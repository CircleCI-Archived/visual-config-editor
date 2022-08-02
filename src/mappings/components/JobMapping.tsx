import {
  Job,
  orb,
  parsers,
  reusable,
  workflow,
} from '@circleci/circleci-config-sdk';
import JobNode from '../../components/atoms/nodes/JobNode';
import JobSummary from '../../components/atoms/summaries/JobSummary';
import JobInspector from '../../components/containers/inspector/JobInspector';
import { componentParametersSubtypes } from '../../components/containers/inspector/subtypes/ParameterSubtypes';
import JobIcon from '../../icons/components/JobIcon';
import {
  DefinitionAction,
  definitionsAsArray,
} from '../../state/DefinitionStore';
import InspectableMapping from '../InspectableMapping';
import { UNDEFINED_COMMAND } from './CommandMapping';
import { UNDEFINED_EXECUTOR } from './ExecutorMapping';

export const JobMapping: InspectableMapping<Job, workflow.WorkflowJob> = {
  key: 'jobs',
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
    commands: (prev, cur: reusable.CustomCommand, j) => {
      let steps;

      if (cur) {
        steps = j.steps.map((step) =>
          step instanceof reusable.ReusableCommand && step.name === prev.name
            ? new reusable.ReusableCommand(cur, step.parameters)
            : step,
        );
      } else {
        steps = j.steps.filter((step) =>
          step instanceof reusable.ReusableCommand
            ? step.name !== prev.name
            : true,
        );
      }

      return new reusable.ParameterizedJob(
        j.name,
        j.executor,
        j instanceof reusable.ParameterizedJob ? j.parameters : undefined,
        steps,
      );
    },
    executors: (_, cur, j) => {
      return new reusable.ParameterizedJob(
        j.name,
        cur?.reuse() || UNDEFINED_EXECUTOR,
        j instanceof reusable.ParameterizedJob ? j.parameters : undefined,
        j.steps,
      );
    },
  },
  resolveObservables: (job) => {
    const reusedExecutor =
      job.executor instanceof reusable.ReusedExecutor
        ? job.executor.executor
        : undefined;
    const orbExec =
      reusedExecutor instanceof orb.OrbRef ? reusedExecutor : undefined;

    const orbCommands = job.steps.filter(
      (command) =>
        command instanceof reusable.ReusableCommand &&
        command.name.includes('/'),
    );

    return {
      executors: orbExec ? undefined : reusedExecutor,
      commands: job.steps.filter(
        (command) =>
          command instanceof reusable.ReusableCommand &&
          !command.name.includes('/'),
      ),
      orbs: orbExec ? [orbExec, ...orbCommands] : orbCommands,
    };
  },
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
      definitionsAsArray(definitions.orbs),
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
    link: 'https://circleci.com/docs/concepts/#jobs',
  },
  requirements: [
    {
      message: 'You must define at least one executor before creating a job.',
      test: (store) => Object.values(store.executors).length > 0,
    },
  ],
};

export type JobAction = DefinitionAction<Job>;

export type JobActions = {
  define_jobs: JobAction;
  update_jobs: JobAction;
  delete_jobs: JobAction;
  cleanup_jobs: JobAction;
};
