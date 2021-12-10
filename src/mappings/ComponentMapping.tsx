import {
  commands,
  executor,
  Job,
  parameters,
} from '@circleci/circleci-config-sdk';
import { ActionCreator, Actions, State } from 'easy-peasy';
import { FormikValues } from 'formik';
import { ReactElement } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { ComponentParameterType } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import Store, {
  DefinitionModel,
  NavigationComponent,
  UpdateType,
} from '../state/Store';
import CommandMapping from './CommandMapping';
import ExecutorMapping from './ExecutorMapping';
import JobMapping from './JobMapping';
import ParameterMapping from './ParameterMapping';

/**
 * Interface to add a circleci-config-sdk component to a data mapping.
 */
export interface DataMapping {
  type: string;
  component: any[];
  mapping: ComponentMapping;
}

/**
 * Registry of circleci-config-sdk component to data maps.
 */

// thinking of adding a docs link to Executor and description as a key to each Mapping
const dataMappings: DataMapping[] = [
  {
    type: 'executors',
    component: [
      executor.DockerExecutor,
      executor.MacOSExecutor,
      executor.MachineExecutor,
      executor.WindowsExecutor,
    ],
    mapping: ExecutorMapping,
  },
  {
    type: 'jobs',
    component: [Job],
    mapping: JobMapping,
  },
  {
    type: 'commands',
    component: [commands.reusable.CustomCommand],
    mapping: CommandMapping,
  },
  {
    type: 'parameters',
    component: [parameters.CustomParameter],
    mapping: ParameterMapping,
  },
];

/**
 * Utility function for converting a component into a mapping type.
 * @param {any} data:any
 * @returns {any}
 */
const componentToType = (data: any): ComponentMapping | undefined => {
  let foundType = undefined;

  dataMappings.forEach((mapping) => {
    if (typeof data === 'string' && mapping.type === data) {
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

export { componentToType, dataMappings };

type storeType = typeof Store;

type KeysOfUnion<T> = T extends T ? keyof T : never;

export interface SubTypeMapping {
  text: string;
  description?: string;
  docsLink?: string;
  fields: ReactElement | React.FunctionComponent<any>;
}

export interface ComponentInfoType {
  description: string
  link: string
}

/**
 * circleci-config-sdk Component to Data Mapping
 *
 * @interface
 */
export default interface ComponentMapping<
  ConfigDataType = any,
  ConfigNodeProps = any,
  InspectorDefaults = any,
> {
  /**  String name type of component. Must be equal to index within registry. */
  type: string;
  /**  Language values of component. This should be used for UI display only. */
  name: {
    singular: string;
    plural: string;
  };
  /** Default values to populate inspectors
   *  @todo need to add support for subtype defaults
   */
  defaults: {
    [K in KeysOfUnion<ConfigDataType | InspectorDefaults>]?: any;
  };
  /**
   * Is true when the component can accept parameters.
   */
  parameters?: ComponentParameterType;
  docsInfo: ComponentInfoType;
  /** Transform field values into an instance of ConfigDataType */
  transform: (
    values: { [K: string]: any },
    definitions: DefinitionModel,
  ) => ConfigDataType | undefined;
  store: {
    /** Returns easy-peasy state hook for component array */
    get: (state: State<storeType>) => ConfigDataType[] | undefined;
    /** Returns easy-peasy add action hook for component array */
    add: (state: Actions<storeType>) => ActionCreator<ConfigDataType>;
    /** Returns easy-peasy update action hook for data type */
    update: (
      state: Actions<storeType>,
    ) => (data: UpdateType<ConfigDataType>) => void;
    /** Returns easy-peasy removal action hook for data type */
    remove: (state: Actions<storeType>) => (data: ConfigDataType) => void;
  };
  /**
   * Name of target that a definition can be tragged to.
   * Currently only 'workflow' or 'job'
   */
  dragTarget?: string;
  /**
   * Called from a node to apply datatype to the applied node
   * @todo Potentially support multiple node types.
   * @returns Object populated with values of ConfigNodeProps */
  applyToNode?: (
    data: ConfigDataType,
    nodeData: ConfigNodeProps,
  ) => { [K in KeysOfUnion<ConfigNodeProps>]?: any };
  node?: {
    /** Transform definition data */
    transform?: (data: ConfigDataType, extras?: any) => ConfigNodeProps;
    /** @todo: Add store functionality to better support updating defintions and their corresponding workflow nodes */
    component: React.FunctionComponent<{ data: ConfigNodeProps } & NodeProps>;
  };
  subtypes?: {
    component: NavigationComponent;
    definitions: { [subtype: string]: SubTypeMapping };
  };
  components: {
    /** Icon Component to render in definition */
    icon?: React.FunctionComponent<any>;
    /** Component to render in definition */
    summary: React.FunctionComponent<{ data: ConfigDataType }>;
    /**
     * Called by InspectorPane and CreateNew to generate form
     * @returns Function which returns a Formik Form object*/
    inspector: (
      props: FormikValues & {
        definitions: DefinitionModel;
        subtype?: any;
      },
      // data: ConfigDataType;
    ) => JSX.Element;
  };
}
