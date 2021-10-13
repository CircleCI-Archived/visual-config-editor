import ConfigData from "./ConfigData";
import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor";
import ExecutorSummary from "../components/containers/summaries/ExecutorSummary";
import ExecutorInspector from "../components/containers/inspector/ExecutorInspector";
import ExecutorIcon from "../icons/ExecutorIcon";
import { Executor } from "@circleci/circleci-config-sdk";

export type anyExecutor = Executor.DockerExecutor | Executor.MacOSExecutor | Executor.MachineExecutor | Executor.WindowsExecutor | AbstractExecutor

const ExecutorData = (): ConfigData<anyExecutor> => {
  return {
    name: {
      singular: "Executor",
      plural: "Executors"
    },
    defaults: {
      name: 'New Executor',
      image: 'cimg/base:latest'
    },
    transform: (values) => new Executor.DockerExecutor(values.name, values.image.name || 'cimg/base:latest'),
    store: {
      get: (state) => state.definitions.executors,
      add: (actions) => actions.defineExecutor,
      update: (actions) => actions.updateExecutor,
      remove: (actions) => actions.undefineExecutor
    },
    dragTarget: 'job',
    components: {
      icon: ExecutorIcon,
      summary: ExecutorSummary,
      inspector: ExecutorInspector,
    }
  }
}

export default ExecutorData();
