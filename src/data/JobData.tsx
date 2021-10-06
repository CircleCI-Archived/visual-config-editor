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
    store: {
      get: (state) => {
        return state.definitions.jobs;
      },
      add: (actions, job) => {

      },
      update: (actions, job) => {

      },
      remove: (actions, job) => {

      },
    },
    node: {
      dragTarget: 'workflow',
      store: {
        // get: (state, workflowName) => {
        //   return ;
        // },
        add: (actions, job) => {

        },
        update: (actions, job) => {

        },
        remove: (actions, job) => {

        }
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
