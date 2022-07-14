import {
  Job,
  orb,
  parameters,
  reusable,
  Workflow,
} from '@circleci/circleci-config-sdk';
import { Generable } from '@circleci/circleci-config-sdk/dist/src/lib/Components';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { Action, action, ActionCreator, ThunkOn, thunkOn } from 'easy-peasy';
import { store } from '../App';
import { CommandActions, CommandMapping } from '../mappings/CommandMapping';
import { ExecutorActions, ExecutorMapping } from '../mappings/ExecutorMapping';
import GenerableMapping from '../mappings/GenerableMapping';
import { JobActions, JobMapping } from '../mappings/JobMapping';
import {
  ParameterActions,
  ParameterMapping,
} from '../mappings/ParameterMapping';
import { UpdateType } from './Store';

export type DefinitionType = 'parameters' | 'jobs' | 'commands' | 'executors';

export type NamedGenerable = Generable & { name: string };

/***
 * @param observers - a list of dependent components which observe
 * @param observables - a list of dependent components which observe
 * @param value - current value of this definition
 */
export type Definition<G> = {
  observers?: Array<DefinitionSubscription>;
  observables?: Array<DefinitionSubscription>;
  value: G;
};

export type SubscriptionCallback<
  Observer extends NamedGenerable,
  Observable extends NamedGenerable,
> = (prev: Observable, cur: Observable, observer: Observer) => Observer;

export type DefinitionSubscription = {
  type: DefinitionType;
  name: string;
};

/**
 * Definition Records String to Definition map.
 * Definition must be some type of Generable.
 */
export type DefinitionRecord<G extends Generable> = Record<
  string,
  Definition<G>
>;

/**
 * Component definitions which are used to generate the configuration
 */
export type DefinitionsModel = {
  commands: DefinitionRecord<reusable.CustomCommand>;
  executors: DefinitionRecord<reusable.ReusableExecutor>;
  jobs: DefinitionRecord<reusable.ParameterizedJob>;
  workflows: DefinitionRecord<Workflow>;
  parameters: DefinitionRecord<
    parameters.CustomParameter<PipelineParameterLiteral>
  >;
  orbs: DefinitionRecord<orb.OrbImport>;
};

/**
 * Definition Action wraps generable components life cycle actions and handles the core events
 */
export type DefinitionAction<G extends NamedGenerable> = Action<
  DefinitionsStoreModel,
  G | UpdateType<G>
>;

export const mapDefinitions = <G extends NamedGenerable>(
  definitions: DefinitionRecord<G>,
  callback: (definition: G) => any,
) => {
  return Object.values(definitions).map((definition) =>
    callback(definition.value),
  );
};

export const definitionsAsArray = <G extends NamedGenerable>(
  definitions: DefinitionRecord<G>,
) => {
  return Object.values(definitions).map((definition) => definition.value);
};

/***
 * Create wrappers for definition actions
 */
export const createDefinitionActions = <G extends NamedGenerable>(
  mapping: GenerableMapping<G>,
  onSet?: (store: DefinitionsStoreModel, value: G) => void,
  onUpdate?: (store: DefinitionsStoreModel, value: UpdateType<G>) => G,
  onDispose?: () => void,
): Record<string, DefinitionAction<G>> => {
  const type = mapping.type;

  return {
    [`define_${type}`]: action((state, payload: G) => {
      const oldState = state.definitions[type];
      let subscriptions: DefinitionSubscription[] = [];
      const observables = mapping.subscriptions
        ? Object.assign(
            {},
            ...Object.keys(mapping.subscriptions).map((key) => ({ [key]: {} })),
          )
        : [];

      if (mapping.resolveObservers && observables) {
        const observerGenerables = mapping.resolveObservers(payload) as Record<
          DefinitionType,
          NamedGenerable
        >;

        Object.entries(observerGenerables).forEach(
          ([observableType, oneOrMore]) => {
            if (Array.isArray(oneOrMore)) {
              subscriptions.concat(
                oneOrMore.map((generable) => {
                  const observableTarget =
                    state.definitions[observableType as DefinitionType][
                      generable.name
                    ];
                  const otherObservers = observableTarget.observers;
                  const observerSub = { type, name: payload.name };

                  observables[observableType][generable.name] = {
                    ...(observableTarget || {}),
                    observers: otherObservers
                      ? [...(otherObservers || []), observerSub]
                      : [observerSub],
                  };

                  return {
                    type: observableType,
                    name: generable.name,
                  } as DefinitionSubscription;
                }),
              );
            } else {
              const observableTarget =
                state.definitions[observableType as DefinitionType][
                  oneOrMore.name
                ];
              const otherObservers = observableTarget.observers;
              const observerSub = { type, name: payload.name };

              observables[observableType][oneOrMore.name] = {
                ...(observableTarget || []),
                observers: otherObservers
                  ? [...otherObservers, observerSub]
                  : [observerSub],
              };
              subscriptions.push({
                type: observableType,
                name: oneOrMore.name,
              } as DefinitionSubscription);
            }
          },
        );
      }

      state.definitions = {
        ...state.definitions,
        ...(observables || {}),
        [type]: {
          ...oldState,
          ...(observables[type] || {}),
          [payload.name]: {
            observers: subscriptions || [],
            value: payload,
          },
        },
      };

      onSet && onSet(state, payload);

      if (!mapping?.subscriptions || !mapping.resolveObservers) {
        return;
      }
    }),
    [`update_${type}`]: action((state, payload: UpdateType<G>) => {
      const newDefinition = onUpdate ? onUpdate(state, payload) : payload.new;
      const oldState = state.definitions[type];
      const oldDefinition = oldState[payload.old.name];

      const newDefinitions = {
        ...oldState,
        [payload.new.name]: {
          observers: oldDefinition.observers,
          observables: oldDefinition.observables,
          value: newDefinition,
        },
      };

      if (payload.new.name !== payload.old.name) {
        delete newDefinitions[payload.old.name];
      }

      state.definitions[type] = newDefinitions as DefinitionRecord<any>;
    }),
    [`delete_${type}`]: action((state: DefinitionsStoreModel, payload: G) => {
      const newDefinitions = {
        ...state.definitions,
      };

      delete newDefinitions[type][payload.name];

      onDispose && onDispose();
    }),
  };
};

export type AllDefinitionActions = JobActions &
  ExecutorActions &
  CommandActions &
  ParameterActions;

export type DefinitionSubscriptionThunk = ThunkOn<
  AllDefinitionActions,
  UpdateType<NamedGenerable>
>;

export type MappingSubscriptions<
  Observer extends NamedGenerable,
  Observables extends NamedGenerable,
  Types extends DefinitionType,
> = Record<Types, SubscriptionCallback<Observer, Observables>>;

export type ObserverMapping<Observer extends NamedGenerable> =
  GenerableMapping<Observer> &
    Required<Pick<GenerableMapping<Observer>, 'subscriptions'>>;

const createObserverSubscription = <
  Observer extends NamedGenerable,
  Observables extends NamedGenerable,
>(
  observableType: DefinitionType,
  subscription: SubscriptionCallback<Observer, Observables>,
): DefinitionSubscriptionThunk => {
  return thunkOn(
    (actions) => actions[`update_${observableType}`],
    async (actions, target) => {
      const change = target.payload as unknown as UpdateType<Observables>;
      const name = change.new.name;
      const definitions = store.getState().definitions;
      const observers = definitions[observableType][name].observers;

      if (!observers) {
        return;
      }

      observers.forEach((observerSub) => {
        const observer = definitions[observerSub.type][observerSub.name]
          .value as unknown as Observer;
        const observerUpdate = actions[
          `update_${observerSub.type}`
        ] as unknown as ActionCreator<UpdateType<Observer>>;

        observerUpdate({
          old: observer,
          new: subscription(change.old, change.new, observer),
        });
      });
    },
  );
};

export const createSubscriptionThunks = <
  Observer extends NamedGenerable,
  Observables extends NamedGenerable,
>(
  mapping: ObserverMapping<Observer>,
): Partial<Record<DefinitionType, DefinitionSubscriptionThunk>> => {
  const observerType = mapping.type;

  return Object.assign(
    {},
    ...Object.entries(mapping.subscriptions).map(
      ([observableType, subscription]) => ({
        [`${observerType}_subscribes_to_${observableType}`]:
          createObserverSubscription<Observer, Observables>(
            observableType as DefinitionType,
            subscription,
          ),
      }),
    ),
  );
};

export const createDefinitionStore = (): AllDefinitionActions => {
  return {
    ...createSubscriptionThunks<
      Job,
      reusable.CustomCommand | reusable.ReusableExecutor
    >(JobMapping as ObserverMapping<Job>),
    ...(createDefinitionActions<reusable.CustomCommand>(
      CommandMapping,
    ) as CommandActions),
    ...(createDefinitionActions<Job>(JobMapping) as JobActions),
    ...(createDefinitionActions<reusable.ReusableExecutor>(
      ExecutorMapping,
    ) as ExecutorActions),
    ...(createDefinitionActions<
      parameters.CustomParameter<PipelineParameterLiteral>
    >(ParameterMapping) as ParameterActions),
  };
};

export type DefinitionsStoreModel = { definitions: DefinitionsModel };

export const DefinitionStore: DefinitionsStoreModel = {
  definitions: {
    commands: {},
    executors: {},
    jobs: {},
    workflows: {},
    parameters: {},
    orbs: {},
  },
};
