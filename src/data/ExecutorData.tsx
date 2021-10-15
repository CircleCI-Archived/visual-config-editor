import { Executor, Job } from "@circleci/circleci-config-sdk";
import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor";
import ExecutorInspector from "../components/containers/inspector/ExecutorInspector";
import ExecutorSummary from "../components/containers/summaries/ExecutorSummary";
import ExecutorIcon from "../icons/ExecutorIcon";
import ConfigData from "./ConfigData";
import { WorkflowJob } from "./JobData";

export type anyExecutor = Executor.DockerExecutor | Executor.MacOSExecutor | Executor.MachineExecutor | Executor.WindowsExecutor | AbstractExecutor

const ExecutorData = (): ConfigData<anyExecutor, WorkflowJob> => {
  return {
    type: 'executor',
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
    applyToNode: (data, nodeData) => {
      const oldJob = nodeData.job;

      return { job: new Job(oldJob.name, data, oldJob.steps) }
    },
    components: {
      icon: ExecutorIcon,
      summary: ExecutorSummary,
      inspector: ExecutorInspector,
    }
  }
}

export default ExecutorData();
