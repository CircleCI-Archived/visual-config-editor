import {
  Job,
  parsers,
  reusable,
  workflow,
} from '@circleci/circleci-config-sdk';
import JobNode from '../components/atoms/nodes/JobNode';
import JobSummary from '../components/atoms/summaries/JobSummary';
import JobInspector from '../components/containers/inspector/JobInspector';
import { componentParametersSubtypes } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import JobIcon from '../icons/components/JobIcon';
import { DefinitionAction, definitionsAsArray } from '../state/DefinitionStore';
import GenerableMapping from './GenerableMapping';

export const JobMapping: GenerableMapping<Job, workflow.WorkflowJob> = {
  type: 'jobs',
  name: {
    singular: 'Job',
    plural: 'Jobs',
  },
  defaults: {
    name: 'New Job',
    steps: [],
    executor: { name: 'Select Executor' },
  },
  parameters: componentParametersSubtypes.job,
  subscriptions: {
    commands: (prev, cur, j) => {
      // const steps = j.steps.map(() )

      return new reusable.ParameterizedJob(
        j.name,
        j.executor,
        j instanceof reusable.ParameterizedJob ? j.parameters : undefined,
        j.steps,
      );
    },
    executors: (_, cur, j) => {
      return new reusable.ParameterizedJob(
        j.name,
        cur.reuse(),
        j instanceof reusable.ParameterizedJob ? j.parameters : undefined,
        j.steps,
      );
    },
  },
  resolveObservables: (job) => ({
    executors:
      job.executor instanceof reusable.ReusedExecutor
        ? job.executor.executor
        : undefined,
    commands: job.steps.filter(
      (command) => command instanceof reusable.CustomCommand,
    ),
  }),
  /**
   TODO: Implement this to pass transform method to
   dependsOn: (definitions) => [definitions.commands, definitions.executors],
   */
  transform: ({ name, ...values }, definitions) => {
    return parsers.parseJob(
      name,
      values,
      definitionsAsArray(definitions.commands),
      definitionsAsArray(definitions.executors),
    );
  },
  store: {
    add: (actions) => actions.define_jobs,
    update: (actions) => actions.update_jobs,
    remove: (actions) => actions.delete_jobs,
  },
  dragTarget: 'workflow',
  node: {
    transform: (data, params) => {
      return new workflow.WorkflowJob(data, params);
    },
    component: JobNode,
  },
  components: {
    icon: JobIcon,
    summary: JobSummary,
    inspector: JobInspector,
  },
  docsInfo: {
    description:
      'Collection of steps to be executed within the Executor environment.',
    link: 'https://circleci.com/docs/2.0/concepts/#jobs',
  },
};

export type JobAction = DefinitionAction<Job>;

export type JobActions = {
  define_jobs: JobAction;
  update_jobs: JobAction;
  delete_jobs: JobAction;
};
