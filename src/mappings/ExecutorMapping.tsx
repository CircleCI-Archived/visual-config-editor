import {
  executors,
  Job,
  parseExecutor,
  reusable,
  WorkflowJob,
} from '@circleci/circleci-config-sdk';
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

const ExecutorMapping: ComponentMapping<
  reusable.ReusableExecutor,
  WorkflowJob
> = {
  type: 'executors',
  name: {
    singular: 'Executor',
    plural: 'Executors',
  },
  defaults: {
    docker: {
      name: 'new-docker-executor',
      docker: [
        {
          image: 'cimg/base:stable',
          parameters: {},
        },
      ],
      resource_class: 'medium',
    },
    machine: {
      name: 'new-machine-executor',
      machine: {
        image: 'ubuntu-2004:202111-01',
        parameters: {},
      },
      resource_class: 'medium',
    },
    macos: {
      name: 'new-macos-executor',
      macos: {
        xcode: '13.2.0',
        parameters: {},
      },
      resource_class: 'medium',
    },
    windows: {
      name: 'new-windows-executor',
      machine: {
        image: 'windows-server-2019-vs2019:stable',
        parameters: {},
      },
      resource_class: 'windows.medium',
    },
  },
  parameters: componentParametersSubtypes.executor,
  transform: ({ name, ...values }) => {
    return new reusable.ReusableExecutor(
      name,
      parseExecutor(values) as executors.Executor,
    );
  },
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
    getSubtype: (reusableExec) => {
      const reusableExecsKeys = Object.keys(reusableExec);

      return Object.keys(executorSubtypes).find((subtype) =>
        reusableExecsKeys.includes(subtype),
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
