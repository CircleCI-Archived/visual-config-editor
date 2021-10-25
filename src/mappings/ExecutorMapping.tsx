import { executor, Job } from '@circleci/circleci-config-sdk';
import { AbstractExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor/Executor';
import ExecutorInspector from '../components/containers/inspector/ExecutorInspector';
import ExecutorSummary from '../components/atoms/summaries/ExecutorSummary';
import ExecutorIcon from '../icons/ExecutorIcon';
import ComponentMapping from './ComponentMapping';
import { WorkflowJob } from './JobMapping';

export type AnyExecutor =
  | executor.DockerExecutor
  | executor.MacOSExecutor
  | executor.MachineExecutor
  | executor.WindowsExecutor
  | AbstractExecutor;

export type ReusableExecutor = {
  name: string;
  executor: AnyExecutor;
  type: string;
};

const transform = (values: any) => {
  const subtypes: { [type: string]: () => AnyExecutor } = {
    docker: () =>
      new executor.DockerExecutor(
        values.executor.image.image || 'cimg/base:stable',
        values.executor.resourceClass,
      ),
    machine: () =>
      new executor.MachineExecutor(
        values.executor.resourceClass,
        values.executor.image || 'cimg/base:latest',
      ),
    macos: () =>
      new executor.MacOSExecutor(
        values.executor.xcode,
        values.executor.resourceClass,
      ),
    windows: () =>
      new executor.WindowsExecutor(
        values.executor.image,
        values.executor.resourceClass,
      ),
  };

  return {
    name: values.name,
    executor: subtypes[values.type](),
    type: 'docker',
  };
};

const ExecutorMapping: ComponentMapping<ReusableExecutor, WorkflowJob> = {
  type: 'executor',
  name: {
    singular: 'Executor',
    plural: 'Executors',
  },
  defaults: {
    name: 'New Executor',
    type: 'docker',
    executor: {
      image: {
        image: 'cimg/base:stable',
      },
    },
  },
  transform: transform,
  store: {
    get: (state) => state.definitions.executors,
    add: (actions) => actions.defineExecutor,
    update: (actions) => actions.updateExecutor,
    remove: (actions) => actions.undefineExecutor,
  },
  dragTarget: 'job',
  applyToNode: (data, nodeData) => {
    const oldJob = nodeData.job;

    return {
      job: new Job(oldJob.name, transform({ ...data }).executor, oldJob.steps),
    };
  },
  components: {
    icon: ExecutorIcon,
    summary: ExecutorSummary,
    inspector: ExecutorInspector,
  },
};

export default ExecutorMapping;
