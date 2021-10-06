import { Command, Job, Executor, Pipeline } from "@circleci/circleci-config-sdk";
import { Action, State, StateMapper } from "easy-peasy";
import { Elements } from "react-flow-renderer";
import { ReactElement } from "react-redux/node_modules/@types/react";
import Store, { StoreModel } from "../state/Store";
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

export default interface ConfigData<ConfigDataType = any, ConfigNodeProps = any> {
  name: {
    singular: string;
    plural: string;
  },
  
  store: {
    get: (state: State<storeType>) => ConfigDataType[] | undefined;
    add: (state: Action<storeType>, data: ConfigDataType) => void;
    update: (state: Action<storeType>, data: ConfigDataType) => void;
    remove: (state: Action<storeType>, data: ConfigDataType) => void;
  },

  node?: {
    dragTarget?: string,
    store: {
      get: (state: State<storeType>, workflowName: string) => Elements<ConfigNodeProps> | undefined;
      add: (state: Action<storeType>, data: ConfigNodeProps) => void;
      update: (state: Action<storeType>, data: ConfigNodeProps) => void;
      remove: (state: Action<storeType>, data: ConfigNodeProps) => void;
    },
    component: React.FunctionComponent<{ data: ConfigNodeProps }>
  }

  components: {
    icon?: React.FunctionComponent<any>;
    summary: React.FunctionComponent<{ data: ConfigDataType }>;
    inspector: React.FunctionComponent<{ data: ConfigDataType }>;
  }
}