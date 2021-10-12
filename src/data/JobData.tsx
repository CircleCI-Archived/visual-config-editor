import { Job } from "@circleci/circleci-config-sdk";
import ConfigData from "./ConfigData";
import JobInspector from "../components/containers/inspector/JobInspector";
import JobNode, { JobNodeProps } from "../components/containers/nodes/JobNode";
import JobIcon from "../icons/JobIcon";
import JobSummary from "../components/containers/summaries/JobSummary";

const JobData = (): ConfigData<Job, JobNodeProps> => {
  return {
    name: {
      singular: "Job",
      plural: "Jobs"
    },
    defaults: {
      name: 'New Job',
    },
    transform: (defaults) => {
      return new Job(defaults.name, defaults.executor, defaults.steps);
    },
    store: {
      get: (state) => {
        return state.definitions.jobs;
      },
      add: (actions) => actions.defineJob,
      update: (actions) => actions.updateJob,
      remove: (actions) => actions.undefineJob,
    },
    node: {
      dragTarget: 'workflow',
      type: 'job',
      transform: (data) => {
        return {
          parameters: {
          },
          job: data
        }
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
