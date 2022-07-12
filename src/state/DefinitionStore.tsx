import {
  Job,
  orb,
  parameters,
  reusable,
  Workflow,
} from '@circleci/circleci-config-sdk';
import { Generable } from '@circleci/circleci-config-sdk/dist/src/lib/Components';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { Action, action } from 'easy-peasy';
import CommandMapping, { CommandActions } from '../mappings/CommandMapping';
import ExecutorMapping, { ExecutorActions } from '../mappings/ExecutorMapping';
import GenerableMapping from '../mappings/GenerableMapping';
import JobMapping, { JobActions } from '../mappings/JobMapping';
import ParameterMapping, {
  ParameterActions,
} from '../mappings/ParameterMapping';
import { UpdateType } from './Store';

export type DefinitionType =
  | 'parameters'
  | 'workflows'
  | 'jobs'
  | 'commands'
  | 'executors'
  | 'orbs';

export type NamedGenerable = Generable & { name: string };

// Definitions will create a subscription that triggers a constant function when a change is made.
export type Definition<G> = {
  dependencies: Partial<Record<DefinitionType, NamedGenerable>>;
  value: G;
};

export type DefinitionSubscription<Generable> = (
  prev: Generable,
  cur: Generable,
  observer: Generable,
) => void;

export type DefinitionRecord<G extends Generable> = Record<
  string,
  Definition<G>
>;

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

/** Create wrappers for definition actions */
export const createDefinitionActions = <G extends NamedGenerable>(
  type: DefinitionType,
  mapping: GenerableMapping,
  onSet?: (store: DefinitionsStoreModel, value: G) => void,
  onUpdate?: (store: DefinitionsStoreModel, value: UpdateType<G>) => G,
  onDispose?: () => void,
): {
  [x: string]: DefinitionAction<G>;
} => {
  return {
    [`define_${type}`]: action((state, payload: G) => {
      const oldState = state.definitions[type];

      state.definitions = {
        ...state.definitions,
        [type]: {
          ...oldState,
          [payload.name]: {
            dependencies: oldState[payload.name]?.dependencies,
            value: payload,
          },
        },
      };

      onSet && onSet(state, payload);

      if (!mapping.subscriptions) {
        return;
      }

      // const subscriptions = Object.assign(
      //   {},
      //   ...mapping.subscriptions.map((value) =>
      //     value ? { [value]: {} } : undefined,
      //   ),
      // );

      // state.definitions.jobs[] = push({
      //   subscriptions,
      //   value: payload,
      // });

      // const subscriptions = Object.keys(mapping.subscriptions);

      // subscriptions.forEach((subscription) => {
      //   const definition = subscription as DefinitionType;

      //   state[definition].subscriptions[mapping.type]?.push(payload);
      // });
    }),
    [`update_${type}`]: action((state, payload: UpdateType<G>) => {
      // const prevDefinition = state.definitions[type];
      const newDefinition = onUpdate ? onUpdate(state, payload) : payload.new;
      const oldState = state.definitions[type];

      const newDefinitions = {
        ...oldState,
        [payload.new.name]: {
          dependencies: oldState[payload.old.name]?.dependencies,
          value: newDefinition,
        },
      };

      if (payload.new.name !== payload.old.name) {
        delete newDefinitions[payload.old.name];
      }

      state.definitions[type] = newDefinitions as DefinitionRecord<any>;

      // Object.entries(prevDefinition.subscriptions).forEach(
      //   ([type, observers]) => {
      //     observers.forEach((observer) => {
      //       if (mapping.subscriptions) {
      //         const reaction = mapping.subscriptions[type as DefinitionType];

      //         if (reaction) {
      //           reaction(observer, prevDefinition, newDefinition);
      //         }
      //       }
      //     });
      //   },
      // );
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

export const DefinitionActions: AllDefinitionActions = {
  ...(createDefinitionActions<Job>('jobs', JobMapping) as JobActions),
  ...(createDefinitionActions<reusable.ReusableExecutor>(
    'executors',
    ExecutorMapping,
  ) as ExecutorActions),
  ...(createDefinitionActions<
    parameters.CustomParameter<PipelineParameterLiteral>
  >('parameters', ParameterMapping) as ParameterActions),
  ...(createDefinitionActions<reusable.CustomCommand>(
    'commands',
    CommandMapping,
  ) as CommandActions),
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
