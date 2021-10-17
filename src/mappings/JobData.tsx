import { Job } from "@circleci/circleci-config-sdk";
import { WorkflowJobParameters } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/Workflow";
import JobInspector from "../components/containers/inspector/JobInspector";
import JobNode from "../components/atoms/nodes/JobNode";
import JobSummary from "../components/containers/summaries/JobSummary";
// import JobNode, { JobNodeProps } from "../components/containers/nodes/JobNode";
import JobIcon from "../icons/JobIcon";
import ComponentMapping from "./ConfigData";

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
      executor: undefined
    },
    transform: (values) => {
      return new Job(values.name, JSON.parse(values.executor), values.steps);
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
      store: {
        // get: (state, workflowName) => {
        //   return ;
        // },
        // add: (actions) => actions.workflow
        // update: (actions, job) => {

        // },
        // remove: (actions, job) => {

        // }
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
