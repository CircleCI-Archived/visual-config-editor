import { Job, parameters, reusable } from '@circleci/circleci-config-sdk';
import { Generable } from '@circleci/circleci-config-sdk/dist/src/lib/Components';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  Action,
  action,
  ActionCreator,
  Actions,
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
import GenerableMapping, { typeToMapping } from '../mappings/GenerableMapping';
import { StoreActions, StoreModel, UpdateType } from './Store';

export type ParameterDefinition = 'parameters';
export type JobsDefinition = 'jobs';
export type CommandDefinition = 'commands';
export type ExecutorsDefinition = 'executors';
export type WorkflowDefinition = 'workflows';

/**
 * All definition types that are registered to the
 * definition store
 * (orbs are currently handled by the main store for no
 * specific reason TODO: handle orbs here)
 */
export type DefinitionType =
  | ParameterDefinition
  | JobsDefinition
  | ExecutorsDefinition
  | CommandDefinition
  | WorkflowDefinition;

export type NamedGenerable = Generable & { name: string };

/**
 * A wrapper object for a definition that contains the definition's value,
 * and lists of incoming and outgoing definition subscriptions
 */
export type Definition<G> = {
  /** a list of dependent components which observe this definition */
  observers?: DefinitionSubscriptions;
  /** a list of dependencies which this definition observes */
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
  const hooks = mapping.storeHooks;

  return {
    [`define_${defType}`]: action((state, payload: G) => {
      setDefinitions(state, mapping, payload);

      hooks?.add && hooks?.add(state as StoreModel, payload);
    }),
    [`update_${defType}`]: action((state, payload: UpdateType<G>) => {
      const newDefinition = hooks?.update
        ? hooks.update(state as StoreModel, payload)
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

      payload.res && payload.res(undefined);
    }),
    /**
     * triggers a deletion of the definition
     * but does not remove it from the store
     * used to update & unsubscribe observers
     */
    [`delete_${defType}`]: action(() => {
      hooks?.remove && hooks?.remove();
    }),
    // does the actual deletion of the definition
    [`cleanup_${defType}`]: action(
      (state: DefinitionsStoreModel, payload: G) => {
        const newDefinitions = {
          ...state.definitions,
        };

        delete newDefinitions[defType][payload.name];

        hooks?.cleanup && hooks?.cleanup();
      },
    ),
  };
};

/**
 * Creates a thunk that watches the observable update action,
 * and updates the observer according to it's subscription
 */
const createObserverSubscriptions = <
  Observer extends NamedGenerable,
  Observables extends NamedGenerable,
>(
  observableType: DefinitionType,
  subType: 'update' | 'delete',
  extra?: TargetResolver<StoreActions, {}>,
): DefinitionSubscriptionThunk => {
  return thunkOn(
    (actions, empty) => {
      const mainSub: ActionCreator<any> =
        actions[`${subType}_${observableType as DefinitionType}`];

      if (!extra) {
        return mainSub;
      }

      const extraActions = extra(actions, empty);

      return Array.isArray(extraActions)
        ? [...extraActions, mainSub]
        : [extraActions, mainSub];
    },
    async (actions, target) => {
      const payload =
        subType === 'delete'
          ? { old: target.payload, new: undefined }
          : target.payload;
      const change = payload as unknown as UpdateType<Observables>;
      // there won't be a new change if the observable is being deleted
      const name = subType === 'update' ? change.new.name : change.old.name;

      const state = store.getState();
      const definitions = state.definitions;

      const observerSubs = definitions[observableType][name].observers;
      if (!observerSubs) {
        return;
      }

      const updates: Promise<unknown>[] = [];

      Object.entries(observerSubs).forEach(([type, observers]) => {
        const observerType = type as DefinitionType;

        observers &&
          Object.entries(observers).forEach(([name, count]) => {
            const definition = definitions[observerType][name];
            const observer = definition?.value as unknown as Observer;

            if (!observer) return;

            const observerUpdate = actions[
              `update_${observerType}`
            ] as unknown as ActionCreator<UpdateType<Observer>>;

            const subscriptions =
              typeToMapping(observerType)?.mapping.subscriptions;

            if (!subscriptions || !subscriptions[observableType]) return;

            const subscription = subscriptions[observableType];

            subscription &&
              updates.push(
                new Promise((res) => {
                  observerUpdate({
                    old: observer,
                    new: subscription(change.old, change.new, observer),
                    res,
                  });
                }),
              );
          });
      });

      if (subType === 'delete') {
        Promise.all(updates).then(() => {
          const observerCleanup = actions[
            `cleanup_${observableType}`
          ] as unknown as ActionCreator<Observer>;
          observerCleanup(change.old as unknown as Observer);
        });
      }
    },
  );
};

export const createObservableThunks = <
  Observable extends NamedGenerable,
  Observers extends NamedGenerable,
>(
  mapping: ObserverMapping<Observable>,
  observerTypes: Array<DefinitionType>,
): Record<string, DefinitionSubscriptionThunk> => {
  const key = mapping.key;

  return {
    // assign the thunk subscription
    [`trigger_${key}_subscribers`]: createObserverSubscriptions<
      Observable,
      Observers
    >(
      key,
      'update',
      // mapping.externalUpdates,
    ),
    [`trigger_${key}_unsubscriptions`]: createObserverSubscriptions<
      Observable,
      Observers
    >(
      key as DefinitionType,
      'delete',
      // mapping.externalUpdates,
    ),
  };
};

export const generateLifeCycleMatrix = (actions: Actions<StoreActions>) => {
  const lifeCycles = ['define', 'update', 'cleanup'];
  const types: DefinitionType[] = [
    'parameters',
    'commands',
    'jobs',
    'executors',
    'workflows',
  ];

  const matrix: ActionCreator<any>[] = [];

  lifeCycles.forEach((lifecycle) => {
    matrix.push(
      ...types.map(
        (type) => actions[`${lifecycle}_${type}` as keyof AllDefinitionActions],
      ),
    );
  });

  return matrix;
};

export const createDefinitionStore = (): AllDefinitionActions => {
  return {
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
    /*
     * Create thunks for each observable definition.
     * Each type the action type is triggered,
     * the subscription for each observer is fulfilled.
     */
    ...createObservableThunks<reusable.ReusableExecutor, Job>(
      ExecutorMapping as ObserverMapping<reusable.ReusableExecutor>,
      ['jobs'],
    ),
    ...createObservableThunks<
      reusable.CustomCommand,
      reusable.CustomCommand | Job
    >(CommandMapping as ObserverMapping<reusable.CustomCommand>, [
      'commands',
      'jobs',
    ]),
    ...createObservableThunks<WorkflowStage, reusable.CustomCommand | Job>(
      WorkflowMapping as ObserverMapping<WorkflowStage>,
      ['jobs'],
    ),
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
