import {
  Config,
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

export type ParameterDefinition = 'parameters';
export type JobsDefinition = 'jobs';
export type CommandDefinition = 'commands';
export type ExecutorsDefinition = 'executors';
export type DefinitionType =
  | ParameterDefinition
  | JobsDefinition
  | ExecutorsDefinition
  | CommandDefinition;

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
  jobs: DefinitionRecord<Job>;
  workflows: DefinitionRecord<Workflow>;
  parameters: DefinitionRecord<
    parameters.CustomParameter<PipelineParameterLiteral>
  >;
  orbs: DefinitionRecord<orb.OrbImport>;
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

export const createSubscription = (
  state: DefinitionsStoreModel,
  observer: NamedGenerable,
  observerType: DefinitionType,
  observable: NamedGenerable,
  observableType: DefinitionType,
  observableDefs: Record<string, DefinitionRecord<NamedGenerable>>,
): DefinitionSubscription => {
  const observableTarget =
    state.definitions[observableType as DefinitionType][observable.name];
  const otherObservers = observableTarget.observers;
  const observerSub = { type: observerType, name: observer.name };

  observableDefs[observableType][observable.name] = {
    ...(observableTarget || {}),
    observers: otherObservers
      ? [...(otherObservers || []), observerSub]
      : [observerSub],
  };

  return {
    type: observableType,
    name: observable.name,
  } as DefinitionSubscription;
};

export const subscribeToObservables = <G extends NamedGenerable>(
  state: DefinitionsStoreModel,
  mapping: GenerableMapping<G>,
  observer: G,
) => {
  const type = mapping.type;
  let subscriptions: DefinitionSubscription[] = [];
  const observables = mapping.subscriptions
    ? Object.assign(
        {},
        ...Object.keys(mapping.subscriptions).map((key) => ({ [key]: {} })),
      )
    : [];

  if (mapping.resolveObservables && observables) {
    const observerDefinitions = mapping.resolveObservables(observer) as Record<
      DefinitionType,
      NamedGenerable
    >;

    Object.entries(observerDefinitions).forEach(
      ([observableType, oneOrMore]) => {
        if (Array.isArray(oneOrMore)) {
          subscriptions.push(
            ...oneOrMore
              .filter((o) => o !== undefined)
              .map((observable) =>
                createSubscription(
                  state,
                  observer,
                  type,
                  observable,
                  observableType as DefinitionType,
                  observables,
                ),
              ),
          );
        } else if (oneOrMore !== undefined) {
          subscriptions.push(
            createSubscription(
              state,
              observer,
              type,
              oneOrMore,
              observableType as DefinitionType,
              observables,
            ),
          );
        }
      },
    );
  }

  return [observables, subscriptions];
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
  const defType = mapping.type;

  return {
    [`define_${defType}`]: action((state, payload: G) => {
      const oldState = state.definitions[defType];
      const [observables, subscriptions] = subscribeToObservables(
        state,
        mapping,
        payload,
      );

      /*
       * Add new observable list to the corresponding definition record,
       * and define the new definition
       * All types not relevant to this definition will return itself.
       */
      state.definitions = Object.assign(
        {},
        ...Object.entries(state.definitions).map(([type, definitions]) => {
          let recordUpdate = definitions;
          // const isObservable =

          if (type === defType) {
            recordUpdate = {
              ...oldState,
              ...(observables[defType] || {}),
              [payload.name]: {
                observers: subscriptions || [],
                value: payload,
              },
            };
          } else if (type in observables) {
            recordUpdate = {
              ...state.definitions[type as DefinitionType],
              ...observables[type],
            };
          }

          return {
            [type]: recordUpdate,
          };
        }),
      );

      onSet && onSet(state, payload);

      if (!mapping?.subscriptions || !mapping.resolveObservables) {
        return;
      }
    }),
    [`update_${defType}`]: action((state, payload: UpdateType<G>) => {
      const newDefinition = onUpdate ? onUpdate(state, payload) : payload.new;
      const oldState = state.definitions[defType];
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

      state.definitions[defType] = newDefinitions as DefinitionRecord<any>;
    }),
    [`delete_${defType}`]: action(
      (state: DefinitionsStoreModel, payload: G) => {
        const newDefinitions = {
          ...state.definitions,
        };

        delete newDefinitions[defType][payload.name];

        onDispose && onDispose();
      },
    ),
  };
};

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

      observers?.forEach((observerSub) => {
        const observer = definitions[observerSub.type][observerSub.name]
          ?.value as unknown as Observer;

        console.log(definitions[observerSub.type][observerSub.name]);
        if (!observer) {
          return;
        }

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
    ...createSubscriptionThunks<reusable.CustomCommand, reusable.CustomCommand>(
      CommandMapping as ObserverMapping<reusable.CustomCommand>,
    ),
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
