import {
  executors,
  Job,
  parameters,
  reusable,
} from '@circleci/circleci-config-sdk';
import { ActionCreator, Actions, Target, TargetResolver } from 'easy-peasy';
import { ReactElement } from 'react';
import {
  DefinitionsStoreModel,
  DefinitionType,
  MappingSubscriptions,
  NamedGenerable,
} from '../state/DefinitionStore';
import Store, { StoreActions, StoreModel, UpdateType } from '../state/Store';
import { CommandMapping } from './components/CommandMapping';
import { ExecutorMapping } from './components/ExecutorMapping';
import { JobMapping } from './components/JobMapping';
import { ParameterMapping } from './components/ParameterMapping';
import InspectableMapping from './InspectableMapping';

/**
 * Interface to add a circleci-config-sdk component to a data mapping.
 */
export interface DataMapping {
  key: string;
  component: any[];
  mapping: InspectableMapping;
}

/**
 * Registry of circleci-config-sdk component to data maps.
 */

// Maybe add docs link to Executor and description as a key to each Mapping
const dataMappings: DataMapping[] = [
  {
    key: 'executors',
    component: [
      executors.DockerExecutor,
      executors.MacOSExecutor,
      executors.MachineExecutor,
      executors.WindowsExecutor,
    ],
    mapping: ExecutorMapping,
  },
  {
    key: 'jobs',
    component: [Job],
    mapping: JobMapping,
  },
  {
    key: 'commands',
    component: [reusable.CustomCommand],
    mapping: CommandMapping,
  },
  {
    key: 'parameters',
    component: [parameters.CustomParameter],
    mapping: ParameterMapping,
  },
];

/**
 * Utility function for converting a component into a mapping type.
 * @param {any} data:any
 * @returns {any}
 */
const componentToType = (data: any): GenerableMapping | undefined => {
  let foundType = undefined;

  dataMappings.forEach((mapping) => {
    if (typeof data === 'string' && mapping.key === data) {
      foundType = mapping.mapping;
      return;
    } else {
      mapping.component.forEach((type) => {
        if (data instanceof type) {
          foundType = mapping.mapping;
          return;
        }
      });
    }
  });

  return foundType;
};

const typeToComponent = (componentType: string) => {
  return dataMappings.find((mapping) => mapping.key === componentType);
};

export { componentToType, typeToComponent, dataMappings };

export interface SubTypeMapping {
  text: string;
  description?: string;
  docsLink?: string;
  component?: any;
  fields: ReactElement | React.FunctionComponent<any>;
}

type StoreType = typeof Store;

/**
 * circleci-config-sdk Generable to Data Mapping
 *
 * @interface
 */
export default interface GenerableMapping<
  GenerableType extends NamedGenerable = any,
  Subscriptions extends NamedGenerable = any,
  SubscriptionTypes extends DefinitionType = any,
> {
  /**  String name type of component. Must be equal to index within registry. */
  key: DefinitionType;
  subscriptions?: MappingSubscriptions<
    GenerableType,
    Subscriptions,
    SubscriptionTypes
  >;
  store: {
    /** Returns easy-peasy add action hook for component array */
    add: (state: Actions<StoreType>) => ActionCreator<GenerableType>;
    /** Returns easy-peasy update action hook for data type */
    update: (
      state: Actions<StoreType>,
    ) => (data: UpdateType<GenerableType>) => void;
    /** Returns easy-peasy removal action hook for data type */
    remove: (state: Actions<StoreType>) => (data: GenerableType) => void;
    // optional overrides
    onAdd?: (store: DefinitionsStoreModel, value: GenerableType) => void;
    onUpdate?: (
      store: DefinitionsStoreModel,
      value: UpdateType<GenerableType>,
    ) => GenerableType;
    onRemove?: () => void;
  };
  overrides?: {
    add?: (store: StoreModel, value: GenerableType) => void;
    update?: (
      store: StoreModel,
      value: UpdateType<GenerableType>,
    ) => GenerableType;
    remove?: () => void;
  };
  /**
   * Store action resolver to watch other actions for changes.
   */
  externalUpdates?: (
    actions: TargetResolver<StoreActions, {}>,
  ) => Target | Target[];
  resolveObservables?: (
    generable: GenerableType,
  ) => Record<SubscriptionTypes, Subscriptions | Subscriptions[]>;
}
