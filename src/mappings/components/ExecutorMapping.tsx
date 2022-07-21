import {
  executors,
  Job,
  parsers,
  reusable,
  workflow,
} from '@circleci/circleci-config-sdk';
import ExecutorSummary from '../../components/atoms/summaries/ExecutorSummary';
import ExecutorInspector from '../../components/containers/inspector/ExecutorInspector';
import { executorSubtypes } from '../../components/containers/inspector/subtypes/ExecutorSubtypes';
import { componentParametersSubtypes } from '../../components/containers/inspector/subtypes/ParameterSubtypes';
import ExecutorTypePageNav from '../../components/menus/definitions/subtypes/ExecutorTypePage';
import ExecutorIcon from '../../icons/components/ExecutorIcon';
import { DefinitionAction } from '../../state/DefinitionStore';
import InspectableMapping from '../InspectableMapping';
import { JobMapping } from './JobMapping';

export type AnyExecutor =
  | executors.DockerExecutor
  | executors.MacOSExecutor
  | executors.MachineExecutor
  | executors.WindowsExecutor
  | executors.Executor;

export const ExecutorMapping: InspectableMapping<
  reusable.ReusableExecutor,
  workflow.WorkflowJob
> = {
  key: 'executors',
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
    return parsers.parseReusableExecutor(name, values);
  },
  store: {
    add: (actions) => actions.define_executors,
    update: (actions) => actions.update_executors,
    remove: (actions) => actions.delete_executors,
  },
  dragTarget: JobMapping.key,
  applyToNode: (data, { job, parameters }) => {
    let params = { ...parameters };

    if (!(job instanceof Job)) {
      let executors = job.parameters.parameters.filter(
        (param) => param.type === 'executor',
      );

      if (executors.length === 0) {
        // TODO: Prompt user to add executor parameter
      } else if (executors.length === 1) {
        params[executors[0].name] = data.name;
      } else {
        // TODO: Prompt user to select executor parameter
      }
    }

    return new workflow.WorkflowJob(job, params);
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
    description:
      'Technology/Environment which Jobs execute their steps inside of.',
    link: 'https://circleci.com/docs/2.0/executor-types/',
  },
};

export type ExecutorAction = DefinitionAction<reusable.ReusableExecutor>;

export type ExecutorActions = {
  define_executors: ExecutorAction;
  update_executors: ExecutorAction;
  delete_executors: ExecutorAction;
};
