import { Job } from "@circleci/circleci-config-sdk";
import { WorkflowJobParameters } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/Workflow";
import JobInspector from "../components/containers/inspector/JobInspector";
import JobNode from "../components/atoms/nodes/JobNode";
import JobSummary from "../components/atoms/summaries/JobSummary";
import JobIcon from "../icons/JobIcon";
import ComponentMapping from "./ComponentMapping";
import ExecutorMapping from "./ExecutorMapping";

export interface WorkflowJob {
  job: Job,
  parameters?: WorkflowJobParameters
}

const JobMapping = (): ComponentMapping<Job, WorkflowJob> => {
  return {
    type: 'job',
    name: {
      singular: "Job",
      plural: "Jobs"
    },
    defaults: {
      name: 'New Job',
      executor: undefined,
      steps: [],
      step: { parameters: {} }
    },
    transform: (values) => {
      return new Job(values.name, ExecutorMapping.transform({ ...JSON.parse(values.executor) }).executor, values.steps);
    },
    store: {
      get: (state) => {
        return state.definitions.jobs;
      },
      add: (actions) => actions.defineJob,
      update: (actions) => actions.updateJob,
      remove: (actions) => actions.undefineJob,
    },
    dragTarget: 'workflow',
    node: {
      type: 'job',
      transform: (data) => {
        return { job: data }
      },
      component: JobNode,
    },
    components: {
      icon: JobIcon,
      summary: JobSummary,
      inspector: JobInspector,
    }
  }
}

export default JobMapping();
