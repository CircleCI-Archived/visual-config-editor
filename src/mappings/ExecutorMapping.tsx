import { executor, Job } from '@circleci/circleci-config-sdk';
import ExecutorInspector from '../components/containers/inspector/ExecutorInspector';
import ExecutorSummary from '../components/atoms/summaries/ExecutorSummary';
import ExecutorIcon from '../icons/components/ExecutorIcon';
import ComponentMapping from './ComponentMapping';
import { WorkflowJob } from './JobMapping';
import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor';
import { Executor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor/exports/Executor';

export type AnyExecutor =
  | executor.DockerExecutor
  | executor.MacOSExecutor
  | executor.MachineExecutor
  | executor.WindowsExecutor
  | Executor;

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

  return new executor.ReusableExecutor(values.name, subtypes[values.type]());
};

const ExecutorMapping: ComponentMapping<ReusableExecutor, WorkflowJob> = {
  type: 'executor',
  name: {
    singular: 'Executor',
    plural: 'Executors',
  },
  defaults: {
    name: 'default',
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
      job: new Job(oldJob.name, data, oldJob.steps),
    };
  },
  components: {
    icon: ExecutorIcon,
    summary: ExecutorSummary,
    inspector: ExecutorInspector,
  },
};

export default ExecutorMapping;
