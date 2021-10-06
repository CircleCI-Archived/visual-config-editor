import ConfigData from "./ConfigData";
import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor";
import ExecutorSummary from "../components/containers/summaries/ExecutorSummary";
import ExecutorInspector from "../components/containers/inspector/ExecutorInspector";
import ExecutorIcon from "../icons/ExecutorIcon";

const ExecutorData = (): ConfigData<AbstractExecutor> => {
  return {
    name: {
      singular: "Executor",
      plural: "Executors"
    },
    store: {
      get: (state) => {
        return state.definitions.executors;
      },
      add: (actions, job) => {

      },
      update: (actions, job) => {

      },
      remove: (actions, job) => {

      },
    },
    components: {
      icon: ExecutorIcon,
      summary: ExecutorSummary,
      inspector: ExecutorInspector,
    }
  }
}

export default ExecutorData();
