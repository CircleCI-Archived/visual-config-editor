import { executor, Job } from "@circleci/circleci-config-sdk";
import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Executor/Executor";
import ExecutorInspector from "../components/containers/inspector/ExecutorInspector";
import ExecutorSummary from "../components/containers/summaries/ExecutorSummary";
import ExecutorIcon from "../icons/ExecutorIcon";
import ComponentMapping from "./ConfigData";
import { WorkflowJob } from "./JobData";

export type AnyExecutor = executor.DockerExecutor | executor.MacOSExecutor | executor.MachineExecutor | executor.WindowsExecutor | AbstractExecutor

export type ReusableExecutor = { name: string, executor: AnyExecutor }

const ExecutorMapping = (): ComponentMapping<ReusableExecutor, WorkflowJob> => {
  return {
    type: 'executor',
    name: {
      singular: "Executor",
      plural: "Executors"
    },
    defaults: {
      name: 'New Executor',
      executor: {
        image: 'cimg/base:latest'
      }
    },
    transform: (values) => { return { name: values.name, executor: new executor.DockerExecutor(values.executor.image.name || 'cimg/base:latest') } },
    store: {
      get: (state) => state.definitions.executors,
      add: (actions) => actions.defineExecutor,
      update: (actions) => actions.updateExecutor,
      remove: (actions) => actions.undefineExecutor
    },
    dragTarget: 'job',
    applyToNode: (data, nodeData) => {
      const oldJob = nodeData.job;

      return { job: new Job(oldJob.name, data.executor, oldJob.steps) }
    },
    components: {
      icon: ExecutorIcon,
      summary: ExecutorSummary,
      inspector: ExecutorInspector,
    }
  }
}

export default ExecutorMapping();
