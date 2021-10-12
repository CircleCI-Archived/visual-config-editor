import { Command, Job, Executor, Pipeline } from "@circleci/circleci-config-sdk";
import { Action, ActionCreator, Actions, State, StateMapper } from "easy-peasy";
import { FormikConfig, FormikProps, FormikValues } from "formik";
import { Elements, FlowElement } from "react-flow-renderer";
import { ReactElement } from "react-redux/node_modules/@types/react";
import Store, { UpdateType } from "../state/Store";
import ExecutorData from "./ExecutorData";
import JobData from "./JobData";

export interface DataMapping {
  component: any[];
  dataType: ConfigData;
}

const dataMappings: DataMapping[] = [
  {
    component: [Job],
    dataType: JobData
  },
  {
    component: [Executor.DockerExecutor, Executor.MacOSExecutor, Executor.MachineExecutor, Executor.WindowsExecutor],
    dataType: ExecutorData
  },
];

const componentToType = (data: any): ConfigData | undefined => {
  let foundType = undefined;

  dataMappings.forEach((mapping) => {
    mapping.component.forEach(type => {
      if (data instanceof type) {
        foundType = mapping.dataType;
        return;
      }
    });
  })

  return foundType;
}

export { componentToType, dataMappings };

type storeType = typeof Store;

type KeysOfUnion<T> = T extends T ? keyof T : never;

export default interface ConfigData<ConfigDataType = any, ConfigNodeProps = any> {
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
  node?: {
    dragTarget?: string,
    type: string,
    transform?: (data: ConfigDataType) => ConfigNodeProps
    store: {
      // get: (state: State<storeType>, workflowName: string) => FlowElement<ConfigNodeProps> | undefined;
      // add: (state: Actions<storeType>) => ActionCreator<ConfigNodeProps>;
      // update: (state: Actions<storeType>) => (data: ConfigNodeProps) => void;
      // remove:  (state: Actions<storeType>) => (data: ConfigNodeProps) => void;
    },
    component: React.FunctionComponent<{ data: ConfigNodeProps }>
  }
  components: {
    icon?: React.FunctionComponent<any>;
    summary: React.FunctionComponent<{ data: ConfigDataType }>;

    inspector: (props: FormikValues & { data: ConfigDataType }) => JSX.Element;
  }
}