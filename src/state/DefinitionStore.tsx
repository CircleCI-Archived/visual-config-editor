import { Job, parameters, reusable } from '@circleci/circleci-config-sdk';
import { Generable } from '@circleci/circleci-config-sdk/dist/src/lib/Components';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  Action,
  action,
  ActionCreator,
  TargetResolver,
  ThunkOn,
  thunkOn,
} from 'easy-peasy';
import { v4 } from 'uuid';
import { store } from '../App';
import { OrbImportWithMeta } from '../components/menus/definitions/OrbDefinitionsMenu';
import {
  CommandActions,
  CommandMapping,
} from '../mappings/components/CommandMapping';
import {
  ExecutorActions,
  ExecutorMapping,
} from '../mappings/components/ExecutorMapping';
import { JobActions, JobMapping } from '../mappings/components/JobMapping';
import {
  ParameterActions,
  ParameterMapping,
} from '../mappings/components/ParameterMapping';
import {
  WorkflowActions,
  WorkflowMapping,
  WorkflowStage,
} from '../mappings/components/WorkflowMapping';
import GenerableMapping from '../mappings/GenerableMapping';
import { StoreActions, StoreModel, UpdateType } from './Store';

export type ParameterDefinition = 'parameters';
export type JobsDefinition = 'jobs';
export type CommandDefinition = 'commands';
export type ExecutorsDefinition = 'executors';
export type WorkflowDefinition = 'workflows';

export type DefinitionType =
  | ParameterDefinition
  | JobsDefinition
  | ExecutorsDefinition
  | CommandDefinition
  | WorkflowDefinition;

export type NamedGenerable = Generable & { name: string };

/***
 * @param observers - a list of dependent components which observe
 * @param observables - a list of dependent components which observe
 * @param value - current value of this definition
 */
export type Definition<G> = {
  observers?: DefinitionSubscriptions;
  observables?: DefinitionSubscriptions;
  value: G;
};

export type SubscriptionCallback<
  Observer extends NamedGenerable,
  Observable extends NamedGenerable,
> = (prev: Observable, cur: Observable, observer: Observer) => Observer;

export type DefinitionSubscriptions = {
  [type in DefinitionType]?: {
    [name: string]: number;
  };
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
  workflows: DefinitionRecord<WorkflowStage>;
  parameters: DefinitionRecord<
    parameters.CustomParameter<PipelineParameterLiteral>
  >;
  orbs: DefinitionRecord<OrbImportWithMeta>;
};

export type AllDefinitionActions = JobActions &
  ExecutorActions &
  CommandActions &
  ParameterActions &
  WorkflowActions;

export type DefinitionSubscriptionThunk = ThunkOn<
  StoreActions,
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
  callback: (definition: G, index: number) => any,
) => {
  return Object.values(definitions).map((definition, index) =>
    callback(definition.value, index),
  );
};

export const definitionsAsArray = <G extends NamedGenerable>(
  definitions: DefinitionRecord<G>,
) => {
  return Object.values(definitions).map((definition) => definition.value);
};

/**
 * Adds observer to observable, and returns the subscription to the observer
 */
export const createSubscription = (
  state: DefinitionsStoreModel,
  observer: NamedGenerable,
  observerType: DefinitionType,
  observable: NamedGenerable,
  observableType: DefinitionType,
  observableDefs: Record<string, DefinitionRecord<NamedGenerable>>,
): DefinitionSubscriptions => {
  const observableTarget = state.definitions[observableType][observable.name];
  const observerSub = { [observer.name]: 1 };

  if (observableTarget?.observers) {
    const otherObservers = observableTarget.observers;

    observableDefs[observableType][observable.name] = {
      ...observableTarget,
      observers: otherObservers[observerType]
        ? {
            ...otherObservers,
            [observerType]: {
              ...otherObservers[observerType],
              ...observerSub,
            },
          }
        : { ...otherObservers, [observerType]: observerSub },
    };
  } else if (observableTarget) {
    observableDefs[observableType][observable.name] = {
      ...observableTarget,
      observers: { [observerType]: observerSub },
    };
  }

  return {
    name: observable.name,
  } as DefinitionSubscriptions;
};

export const subscribeToObservables = <G extends NamedGenerable>(
  state: DefinitionsStoreModel,
  mapping: GenerableMapping<G>,
  observer: G,
) => {
  const type = mapping.key;
  let subscriptions: DefinitionSubscriptions[] = [];
  const observables = mapping.subscriptions
    ? Object.assign(
        {},
        ...Object.keys(mapping.subscriptions).map((key) => ({ [key]: {} })),
      )
    : {};

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

export const setDefinitions = <G extends NamedGenerable>(
  state: DefinitionsStoreModel,
  mapping: GenerableMapping<G>,
  generable: G,
  observers?: DefinitionSubscriptions,
  updateRecord?: (record: DefinitionRecord<G>) => void,
) => {
  const defType = mapping.key;
  const oldState = state.definitions[mapping.key];
  const [otherObservables, subscriptions] = subscribeToObservables(
    state,
    mapping,
    generable,
  );

  /*
   * Add new observable list to the corresponding definition record,
   * and define the new definition
   * All types not relevant to this definition will return itself.
   */
  state.definitions = Object.assign(
    {},
    ...Object.entries(state.definitions).map(([type, definitions]) => {
      let recordUpdate = definitions as unknown as DefinitionRecord<G>;

      if (type === defType) {
        recordUpdate = {
          ...oldState,
          ...(otherObservables[defType] || {}),
          [generable.name]: {
            observables: subscriptions || [],
            observers: observers || {},
            value: generable,
          },
        };

        updateRecord && updateRecord(recordUpdate);
      } else if (type in otherObservables) {
        recordUpdate = {
          ...state.definitions[type as DefinitionType],
          ...otherObservables[type],
        };
      }

      return {
        [type]: recordUpdate,
      };
    }),
  );
};

/***
 * Create wrappers for definition actions
 */
export const createDefinitionActions = <G extends NamedGenerable>(
  mapping: GenerableMapping<G>,
): Record<string, DefinitionAction<G>> => {
  const defType = mapping.key;

  return {
    [`define_${defType}`]: action((state, payload: G) => {
      setDefinitions(state, mapping, payload);
      mapping.overrides?.add &&
        mapping.overrides?.add(state as StoreModel, payload);

      if (!mapping?.subscriptions || !mapping.resolveObservables) {
        return;
      }
    }),
    [`update_${defType}`]: action((state, payload: UpdateType<G>) => {
      const newDefinition = mapping.overrides?.update
        ? mapping.overrides.update(state as StoreModel, payload)
        : payload.new;
      const oldState = state.definitions[defType];
      const oldDefinition = oldState[payload.old.name];

      setDefinitions(
        state,
        mapping,
        newDefinition,
        oldDefinition.observers,
        (definitions) => {
          if (payload.new.name !== payload.old.name) {
            delete definitions[payload.old.name];
          }
        },
      );
    }),
    [`delete_${defType}`]: action(
      (state: DefinitionsStoreModel, payload: G) => {
        const newDefinitions = {
          ...state.definitions,
        };

        delete newDefinitions[defType][payload.name];

        mapping.overrides?.remove && mapping.overrides?.remove();
      },
    ),
  };
};

/**
 * Creates a thunk that watches the observable update action,
 * and updates the observer according to it's subscription
 */
const createObserverSubscription = <
  Observer extends NamedGenerable,
  Observables extends NamedGenerable,
>(
  observableType: DefinitionType,
  observerType: DefinitionType,
  subscription: SubscriptionCallback<Observer, Observables>,
  extra?: TargetResolver<StoreActions, {}>,
): DefinitionSubscriptionThunk => {
  return thunkOn(
    (actions, _) => {
      const mainSub = actions[`update_${observableType}`];

      if (!extra) {
        return mainSub;
      }

      const extraActions = extra(actions, _);

      return Array.isArray(extraActions)
        ? [...extraActions, mainSub]
        : [extraActions, mainSub];
    },
    async (actions, target) => {
      const change = target.payload as unknown as UpdateType<Observables>;
      const name = change.new.name;
      const state = store.getState();
      const definitions = state.definitions;
      const observerSubs = definitions[observableType][name].observers;
      const observer = observerSubs ? observerSubs[observerType] : undefined;

      if (!observer) {
        return;
      }

      Object.entries(observer).forEach(([name, count]) => {
        const definition = definitions[observerType][name];
        const observer = definition?.value as unknown as Observer;

        if (!observer) {
          return;
        }

        const observerUpdate = actions[
          `update_${observerType}`
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
  const observerType = mapping.key;

  return Object.assign(
    {},
    ...Object.entries(mapping.subscriptions).map(
      ([observableType, subscription]) => ({
        // assign the thunk subscription
        [`${observerType}_subscribes_to_${observableType}`]:
          createObserverSubscription<Observer, Observables>(
            observableType as DefinitionType,
            observerType as DefinitionType,
            subscription,
            // mapping.externalUpdates,
          ),
      }),
    ),
  );
};

export const createDefinitionStore = (): AllDefinitionActions => {
  return {
    // thunks - observe actions, and trigger subscriptions
    ...createSubscriptionThunks<
      Job,
      reusable.CustomCommand | reusable.ReusableExecutor
    >(JobMapping as ObserverMapping<Job>),
    ...createSubscriptionThunks<reusable.CustomCommand, reusable.CustomCommand>(
      CommandMapping as ObserverMapping<reusable.CustomCommand>,
    ),
    ...createSubscriptionThunks<WorkflowStage, reusable.CustomCommand | Job>(
      WorkflowMapping as ObserverMapping<WorkflowStage>,
    ),
    // actions - lifecycle for each definition
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
    ...(createDefinitionActions<WorkflowStage>(
      WorkflowMapping,
    ) as WorkflowActions),
  };
};

export type DefinitionsStoreModel = { definitions: DefinitionsModel };

export const DefinitionStore: DefinitionsStoreModel = {
  definitions: {
    commands: {},
    executors: {},
    jobs: {},
    workflows: {
      'build-and-deploy': {
        value: new WorkflowStage('build-and-deploy', v4(), [], undefined, []),
      },
    },
    parameters: {},
    orbs: {},
  },
};
