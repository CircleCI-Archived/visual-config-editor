import { Job } from '@circleci/circleci-config-sdk';
import { WorkflowJobParameters } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/Workflow';
import JobNode from '../components/atoms/nodes/JobNode';
import JobSummary from '../components/atoms/summaries/JobSummary';
import JobInspector from '../components/containers/inspector/JobInspector';
import JobIcon from '../icons/components/JobIcon';
import ComponentMapping from './ComponentMapping';

export interface WorkflowJob {
  job: Job;
  parameters?: WorkflowJobParameters;
}

const JobMapping: ComponentMapping<Job, WorkflowJob> = {
  type: 'job',
  name: {
    singular: 'Job',
    plural: 'Jobs',
  },
  defaults: {
    name: 'New Job',
    executor: undefined,
    steps: [],
    step: { parameters: {} },
  },
  transform: (values, definitions) => {
    const executor = definitions.executors.find(executor => executor.name === values.executor.name);

    if (executor) {
      return new Job(
        values.name,
        executor,
        values.steps,
      );
    }

    throw new Error('Job could not be transformed: Invalid executor');
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
      return { job: data };
    },
    component: JobNode,
  },
  components: {
    icon: JobIcon,
    summary: JobSummary,
    inspector: JobInspector,
  },
};

export default JobMapping;
