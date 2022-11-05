import { Generable } from '@circleci/circleci-config-sdk/dist/src/lib/Components';
import { FormikValues } from 'formik';
    import { Edge, NodeProps } from 'reactflow';
import { IconProps } from '../icons/IconProps';
import {
  DefinitionsModel,
  DefinitionSubscriptions,
  NamedGenerable,
} from '../state/DefinitionStore';
import { NavigationComponent } from '../state/Store';
import { WorkflowStage } from './components/WorkflowMapping';
import GenerableMapping, { SubTypeMapping } from './GenerableMapping';
export interface GenerableInfoType {
  description: string;
  link: string;
}

type KeysOfUnion<T> = T extends T ? keyof T : never;

/**
 * Mapping of a Generable component for inspection
 * Abstraction for the InspectorDefinitionMenu to handle
 */
export default interface InspectableMapping<
  GenerableType extends NamedGenerable = any,
  ConfigNodeProps = any,
  InspectorDefaults = any,
> extends GenerableMapping<GenerableType> {
  guide?: { info: string; step: number };
  /**  Language values of component. This should be used for UI display only. */
  name: {
    singular: string;
    plural: string;
  };
  /** Default values to populate inspectors
   *  @todo need to add support for subtype defaults
   */
  defaults: {
    [K in KeysOfUnion<GenerableType | InspectorDefaults>]?: any;
  };
  /**
   * Is true when the component can accept parameters.
   */
  parameters?: any;
  docsInfo: GenerableInfoType;
  /** Transform field values into an instance of ConfigDataType */
  transform: (
    values: { [K: string]: any },
    store: DefinitionsModel,
  ) => GenerableType | undefined;
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
    data: GenerableType,
    nodeData: ConfigNodeProps,
  ) => { [K in KeysOfUnion<ConfigNodeProps>]?: any };
  node?: {
    /** Transform definition data */
    transform?: (
      data: GenerableType,
      extras?: any,
      stage?: { nodes: Node[], edges: Edge[] },
    ) => ConfigNodeProps;
    /** @todo: Add store functionality to better support updating definitions and their corresponding workflow nodes */
    component: React.FunctionComponent<{ data: ConfigNodeProps } & NodeProps>;
  };
  subtypes?: {
    component: NavigationComponent;
    getSubtype: (data: GenerableType) => string | undefined;
    definitions: { [subtype: string]: SubTypeMapping };
  };
  components: {
    /** Icon Generable to render in definition */
    icon?: React.FunctionComponent<IconProps>;
    /** Generable to render in definition */
    summary: React.FunctionComponent<{ data: GenerableType }>;
    /**
     * Called by InspectorPane and CreateNew to generate form
     * TODO: refactor into useInspector hook
     * @returns Function which returns a Formik Form object*/
    inspector: (
      props: FormikValues & {
        definitions: DefinitionsModel;
        data?: Generable;
        subtype?: string;
        subscriptions?: Array<DefinitionSubscriptions>;
        setSubscriptions?: (subscriptions: DefinitionSubscriptions[]) => void;
      },
      // data: ConfigDataType;
    ) => JSX.Element;
  };
  requirements?: [
    {
      message: string;
      test: (store: DefinitionsModel) => boolean;
    },
  ];
}
