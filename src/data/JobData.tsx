import { Job } from "@circleci/circleci-config-sdk";
import ConfigData from "./ConfigData";
import JobInspector from "../components/containers/inspector/JobInspector";
// import JobNode, { JobNodeProps } from "../components/containers/nodes/JobNode";
import JobIcon from "../icons/JobIcon";
import JobSummary from "../components/containers/summaries/JobSummary";
import JobNode from "../components/containers/nodes/JobNode";
import { WorkflowJobParameters } from "@circleci/circleci-config-sdk/dist/lib/Components/Workflow/Workflow";

export interface WorkflowJob {
  job: Job,
  parameters?: WorkflowJobParameters
}

const JobData = (): ConfigData<Job, WorkflowJob> => {
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

export default JobData();
