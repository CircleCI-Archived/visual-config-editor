import { executor, Job } from "@circleci/circleci-config-sdk";
import { ActionCreator, Actions, State } from "easy-peasy";
import { FormikValues } from "formik";
import { NodeProps } from "react-flow-renderer";
import Store, { DefinitionModel, UpdateType } from "../state/Store";
import ExecutorMapping from "./ExecutorData";
import JobMapping from "./JobData";

export interface DataMapping {
  type: string;
  component: any[];
  dataType: ComponentMapping;
}

const dataMappings: DataMapping[] = [
  {
    type: 'executor',
    component: [executor.DockerExecutor, executor.MacOSExecutor, executor.MachineExecutor, executor.WindowsExecutor],
    dataType: ExecutorMapping
  },
  {
    type: 'job',
    component: [Job],
    dataType: JobMapping
  },
];

/*
* @arg
*/
const componentToType = (data: any): ComponentMapping | undefined => {
  let foundType = undefined;

  dataMappings.forEach((mapping) => {
    if (typeof data === 'string' && mapping.type === data) {
      foundType = mapping.dataType;
      return;
    } else {
      mapping.component.forEach(type => {
        if (data instanceof type) {
          foundType = mapping.dataType;
          return;
        }
      });
    }
  })

  return foundType;
}

export { componentToType, dataMappings };

type storeType = typeof Store;

type KeysOfUnion<T> = T extends T ? keyof T : never;

export default interface ComponentMapping<ConfigDataType = any, ConfigNodeProps = any> {
  type: string,
  name: {
    singular: string;
    plural: string;
  },
  defaults: {
    [K in KeysOfUnion<ConfigDataType>]?: any;
  },
  // Transform field values into an instance of ConfigDataType
  transform: (values: { [K in KeysOfUnion<ConfigDataType>]: any }) => ConfigDataType;
  store: {
    get: (state: State<storeType>) => ConfigDataType[] | undefined;
    add: (state: Actions<storeType>) => ActionCreator<ConfigDataType>;
    update: (state: Actions<storeType>) => (data: UpdateType<ConfigDataType>) => void;
    remove: (state: Actions<storeType>) => (data: ConfigDataType) => void;
  },
  dragTarget?: string,
  applyToNode?: (data: ConfigDataType, nodeData: ConfigNodeProps) => { [K in KeysOfUnion<ConfigNodeProps>]?: any }
  node?: {
    type: string,
    transform?: (data: ConfigDataType) => ConfigNodeProps
    store: {
      // get: (state: State<storeType>, workflowName: string) => FlowElement<ConfigNodeProps> | undefined;
      // add: (state: Actions<storeType>) => ActionCreator<ConfigNodeProps>;
      // update: (state: Actions<storeType>) => (data: ConfigNodeProps) => void;
      // remove:  (state: Actions<storeType>) => (data: ConfigNodeProps) => void;
    },
    component: React.FunctionComponent<{ data: ConfigNodeProps } & NodeProps>
  }
  components: {
    icon?: React.FunctionComponent<any>;
    summary: React.FunctionComponent<{ data: ConfigDataType }>;
    inspector: (definitions: DefinitionModel) => (props: FormikValues & { data: ConfigDataType }) => JSX.Element;
  }
}