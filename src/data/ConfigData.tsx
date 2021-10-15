import { Executor, Job } from "@circleci/circleci-config-sdk";
import { ActionCreator, Actions, State } from "easy-peasy";
import { FormikValues } from "formik";
import { NodeProps } from "react-flow-renderer";
import Store, { DefinitionModel, UpdateType } from "../state/Store";
import ExecutorData from "./ExecutorData";
import JobData from "./JobData";

export interface DataMapping {
  type: string;
  component: any[];
  dataType: ConfigData;
}

const dataMappings: DataMapping[] = [
  {
    type: 'executor',
    component: [Executor.DockerExecutor, Executor.MacOSExecutor, Executor.MachineExecutor, Executor.WindowsExecutor],
    dataType: ExecutorData
  },
  {
    type: 'job',
    component: [Job],
    dataType: JobData
  },
];

const componentToType = (data: any): ConfigData | undefined => {
  let foundType = undefined;

  dataMappings.forEach((mapping) => {
    if (typeof data === 'string' && mapping.type == data) {
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
type ToNode<T> = { [K in KeysOfUnion<T>]: keyof T }

export default interface ConfigData<ConfigDataType = any, ConfigNodeProps = any> {
  type: string,
  name: {
    singular: string;
    plural: string;
  },
  defaults: {
    [K in KeysOfUnion<ConfigDataType>]?: any;
  },
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