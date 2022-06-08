import { Job, parsers, WorkflowJob } from '@circleci/circleci-config-sdk';
import JobNode from '../components/atoms/nodes/JobNode';
import JobSummary from '../components/atoms/summaries/JobSummary';
import JobInspector from '../components/containers/inspector/JobInspector';
import { componentParametersSubtypes } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import JobIcon from '../icons/components/JobIcon';
import ComponentMapping from './ComponentMapping';

const JobMapping: ComponentMapping<Job, WorkflowJob> = {
  type: 'jobs',
  name: {
    singular: 'Job',
    plural: 'Jobs',
  },
  defaults: {
    name: 'New Job',
    steps: [],
  },
  parameters: componentParametersSubtypes.job,
  /**
   TODO: Implement this to pass transform method to 
   dependsOn: (definitions) => [definitions.commands, definitions.executors],
   */
  transform: ({ name, ...values }, definitions) => {
    return parsers.parseJob(
      name,
      values,
      definitions.commands,
      definitions.executors,
    );
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
    transform: (data, params) => {
      return new WorkflowJob(data, params);
    },
    component: JobNode,
  },
  components: {
    icon: JobIcon,
    summary: JobSummary,
    inspector: JobInspector,
  },
  docsInfo: {
    description: 'Collection of steps to run your config',
    link: 'https://circleci.com/docs/2.0/concepts/#jobs',
  },
};

export default JobMapping;
