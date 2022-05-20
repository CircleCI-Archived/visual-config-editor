import { executors, Job, reusable, WorkflowJob } from '@circleci/circleci-config-sdk';
import ExecutorSummary from '../components/atoms/summaries/ExecutorSummary';
import ExecutorInspector from '../components/containers/inspector/ExecutorInspector';
import { executorSubtypes } from '../components/containers/inspector/subtypes/ExecutorSubtypes';
import { componentParametersSubtypes } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import ExecutorTypePageNav from '../components/menus/definitions/subtypes/ExecutorTypePage';
import ExecutorIcon from '../icons/components/ExecutorIcon';
import ComponentMapping from './ComponentMapping';
import JobMapping from './JobMapping';

export type AnyExecutor =
  | executors.DockerExecutor
  | executors.MacOSExecutor
  | executors.MachineExecutor
  | executors.WindowsExecutor
  | executors.Executor;

const transform = (values: any) => {
  const subtypes: { [type: string]: () => AnyExecutor } = {
    docker: () =>
      new executors.DockerExecutor(
        values.executor.image.image || 'cimg/base:stable',
        values.executor.resource_class,
        values.executor.parameters,
      ),
    machine: () =>
      new executors.MachineExecutor(
        values.executor.resource_class,
        values.executor.image || 'cimg/base:latest',
        values.executor.parameters,
      ),
    macos: () =>
      new executors.MacOSExecutor(
        values.executor.xcode,
        values.executor.resource_class,
        values.executor.parameters,
      ),
    windows: () =>
      new executors.WindowsExecutor(
        values.executor.image,
        values.executor.resource_class,
        values.executor.parameters,
      ),
  };

  return new reusable.ReusableExecutor(values.name, subtypes[values.type]());
};

const ExecutorMapping: ComponentMapping<reusable.ReusableExecutor, WorkflowJob> = {
  type: 'executors',
  name: {
    singular: 'Executor',
    plural: 'Executors',
  },
  defaults: {
    docker: {
      name: 'docker',
      executor: {
        image: {
          image: 'cimg/base:stable',
        },
        parameters: {},
      },
      resource_class: 'medium',
    },
    machine: {
      name: 'machine',
      executor: {
        image: 'ubuntu-2004:202111-01',
        parameters: {},
      },
      resource_class: 'medium',
    },
    macos: {
      name: 'macos',
      executor: {
        xcode: '13.2.0',
        parameters: {},
      },
      resource_class: 'medium',
    },
    windows: {
      name: 'windows_server',
      executor: {
        image: 'windows-server-2019-vs2019:stable',
        parameters: {},
      },
      resource_class: 'medium',
    },
  },
  parameters: componentParametersSubtypes.executor,
  transform: transform,
  store: {
    get: (state) => state.definitions.executors,
    add: (actions) => actions.defineExecutor,
    update: (actions) => actions.updateExecutor,
    remove: (actions) => actions.undefineExecutor,
  },
  dragTarget: JobMapping.type,
  applyToNode: (data, nodeData) => {
    const oldJob = nodeData.job;

    return new WorkflowJob(
      new Job(oldJob.name, data, oldJob.steps),
      nodeData.parameters,
    );
  },
  subtypes: {
    component: ExecutorTypePageNav,
    getSubtype: (reusableExec: reusable.ReusableExecutor) => {
      return Object.keys(executorSubtypes).find(
        (subtype) =>
          reusableExec.executor instanceof executorSubtypes[subtype].component,
      );
    },
    definitions: executorSubtypes,
  },
  components: {
    icon: ExecutorIcon,
    summary: ExecutorSummary,
    inspector: ExecutorInspector,
  },
  docsInfo: {
    description: 'Technology/Environment to run with',
    link: 'https://circleci.com/docs/2.0/executor-types/',
  },
};

export default ExecutorMapping;
