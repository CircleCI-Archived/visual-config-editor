import {
  Config,
  Job,
  parameters,
  Workflow,
  WorkflowJob,
} from '@circleci/circleci-config-sdk';
import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Reusable';
import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor';
import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { Action, action } from 'easy-peasy';
import { MutableRefObject } from 'react';
import {
  Elements,
  FlowElement,
  isNode,
  Node,
  SetConnectionId,
  XYPosition,
} from 'react-flow-renderer';
import { v4 } from 'uuid';
import DefinitionsMenu from '../components/menus/definitions/DefinitionsMenu';
import ComponentMapping from '../mappings/ComponentMapping';
import JobMapping from '../mappings/JobMapping';

export interface WorkflowModel {
  name: string;
  id: string;
  elements: Elements<any>;
}

/** Reusable definitions of CircleCIConfigObject */
export interface DefinitionModel /*extends CircleCIConfigObject*/ {
  parameters: CustomParameter<PipelineParameterLiteral>[];
  executors: ReusableExecutor[];
  jobs: Job[];
  commands: CustomCommand[];
  workflows: Workflow[];
}

export interface DataModel {
  data?: any;
  dataType?: ComponentMapping;
}

export interface NavigationModel extends NavigationStop {
  jumpedFrom?: NavigationStop;
  from?: NavigationModel;
}

export interface NavigationComponent {
  Icon?: React.FunctionComponent<any>;
  Component: React.FunctionComponent<any>;
  Label: React.FunctionComponent<any>;
}

export interface NavigationStop {
  component: NavigationComponent;
  props: any;
}

export interface StoreModel {
  /** Last generated configuration */
  config: string | undefined;
  editingConfig: string | undefined;
  /** Last generated configuration */
  definitions: DefinitionModel;

  placeholder?: { index: number; id: string };
  /** Array of workflow panes */
  workflows: WorkflowModel[];
  /** Order of components and the  */
  navigation: NavigationModel;
  /**  */
  dragging?: DataModel;
  connecting?: {
    start?: {
      ref?: MutableRefObject<any>;
      id: SetConnectionId;
      name?: string;
    };
    end?: {
      id: SetConnectionId;
      pos?: XYPosition;
      ref?: MutableRefObject<any>;
      name?: string;
    };
  };
  /** Currently selected workflow pane index */
  selectedWorkflow: number;
}

export interface UpdateType<T> {
  old: T;
  new: T;
}

export interface StoreActions {
  persistProps: Action<StoreModel, unknown>;
  setDragging: Action<StoreModel, DataModel | undefined>;
  setConnecting: Action<
    StoreModel,
    {
      ref?: MutableRefObject<any>;
      id: SetConnectionId;
      name?: string;
    }
  >;
  updateConnecting: Action<
    StoreModel,
    | {
        ref?: MutableRefObject<any>;
        id: SetConnectionId;
        pos?: XYPosition;
        name?: string;
      }
    | undefined
  >;

  setPlaceholder: Action<StoreModel, Node<any>>;

  navigateTo: Action<StoreModel, NavigationStop & { values?: any }>;
  navigateBack: Action<
    StoreModel,
    { distance?: number; apply?: (values: any) => any } | void
  >;

  addWorkflow: Action<StoreModel, string>;
  selectWorkflow: Action<StoreModel, number>;
  removeWorkflow: Action<StoreModel, WorkflowModel>;

  addWorkflowElement: Action<StoreModel, FlowElement<any>>;
  removeWorkflowElement: Action<StoreModel, FlowElement<any>>;
  setWorkflowElements: Action<StoreModel, Elements<any>>;

  defineJob: Action<StoreModel, Job>;
  updateJob: Action<StoreModel, UpdateType<Job>>;

  /** @todo implement job removal */
  undefineJob: Action<StoreModel, Job>;

  /** @todo implement commands */
  defineCommand: Action<StoreModel, CustomCommand>;
  updateCommand: Action<StoreModel, UpdateType<CustomCommand>>;
  undefineCommand: Action<StoreModel, CustomCommand>;

  defineExecutor: Action<StoreModel, ReusableExecutor>;
  updateExecutor: Action<StoreModel, UpdateType<ReusableExecutor>>;
  undefineExecutor: Action<StoreModel, ReusableExecutor>;

  /** @todo implement parameters */
  defineParameter: Action<
    StoreModel,
    CustomParameter<PipelineParameterLiteral>
  >;
  updateParameter: Action<
    StoreModel,
    UpdateType<CustomParameter<PipelineParameterLiteral>>
  >;
  undefineParameter: Action<
    StoreModel,
    CustomParameter<PipelineParameterLiteral>
  >;

  generateConfig: Action<StoreModel, void | Partial<DefinitionModel>>;
  error: Action<StoreModel, any>;
}

const Actions: StoreActions = {
  persistProps: action((state, payload) => {
    state.navigation = { ...state.navigation, props: payload };
  }),
  setConnecting: action((state, payload) => {
    if (payload.ref) {
      state.connecting = {
        start: payload,
      };
    } else {
      state.connecting = undefined;
    }
  }),
  updateConnecting: action((state, payload) => {
    if (state.connecting?.start) {
      state.connecting = {
        start: state.connecting.start,
        end: payload,
      };
    }
  }),
  setPlaceholder: action((state, payload) => {
    const workflow = state.workflows[state.selectedWorkflow];
    if (state.placeholder /** && payload.overwrite */) {
      state.workflows[state.selectedWorkflow] = {
        ...workflow,
        elements: workflow.elements.map((element) =>
          element.id === state.placeholder?.id ? payload : element,
        ),
      };
    } else {
      workflow.elements.push(payload);
    }

    state.placeholder = {
      index: workflow.elements.length - 1,
      id: workflow.id,
    };
  }),

  navigateTo: action((state, payload) => {
    const curNav = state.navigation;

    if (curNav.jumpedFrom) {
      state.navigation.jumpedFrom = undefined;
    }

    state.navigation = {
      ...payload,
      from: {
        ...curNav,
        props: { ...curNav.props, values: payload.values },
      },
    };
  }),

  navigateBack: action((state, payload) => {
    const distance = payload?.distance || 1;

    if (state.navigation.from) {
      let travelTo = state.navigation;

      for (let i = 0; i < distance; i++) {
        if (travelTo.from) {
          travelTo = travelTo.from;
        } else {
          throw new Error('Tried to navigate back to an undefined component!');
        }
      }

      state.navigation = {
        ...travelTo,
        props: {
          ...travelTo.props,
          values:
            payload?.apply?.(travelTo.props.values) || travelTo.props.values,
        },
        jumpedFrom: distance > 1 ? state.navigation : undefined,
      };
    } else {
      state.navigation = { component: DefinitionsMenu, props: {} };
    }
  }),

  setDragging: action((state, payload) => {
    state.dragging = payload;
  }),

  addWorkflow: action((state, name) => {
    state.workflows = state.workflows.concat({
      name,
      id: v4(),
      elements: [],
    });
  }),
  selectWorkflow: action((state, index) => {
    state.selectedWorkflow = index;
  }),
  removeWorkflow: action((state, payload) => {
    state.workflows = state.workflows.filter(
      (workflow) => workflow.id !== payload.id,
    );
  }),

  addWorkflowElement: action((state, payload) => {
    const workflow = state.workflows[state.selectedWorkflow];

    workflow.elements.push(payload);
  }),
  removeWorkflowElement: action((state, payload) => {}),
  setWorkflowElements: action((state, payload) => {
    state.workflows[state.selectedWorkflow].elements = payload;
  }),

  defineJob: action((state, payload) => {
    state.definitions.jobs?.push(payload);
  }),
  updateJob: action((state, payload) => {
    if (state.definitions.jobs) {
      const workflows = state.workflows[state.selectedWorkflow];

      workflows.elements = workflows.elements.map((e) =>
        isNode(e) && e.type === 'job' && e.data.job.name === payload.old.name
          ? { ...e, data: { ...e.data, job: payload.new } }
          : e,
      );

      state.definitions.jobs = state.definitions.jobs.map((job) =>
        job.name === payload.old.name ? payload.new : job,
      );
    }
  }),
  undefineJob: action((state, payload) => {
    state.definitions.jobs = state.definitions.jobs?.filter(
      (job) => job.name === payload.name,
    );
  }),

  defineExecutor: action((state, payload) => {
    state.definitions.executors = state.definitions.executors?.concat(payload);
  }),
  /** @todo fix updating executors since reusable executors have been removed.*/
  updateExecutor: action((state, payload) => {
    if (state.definitions.executors) {
      // const index = state.definitions.executors.findIndex((executor) => executor.name === payload.name)
      // state.definitions.executors[index] = payload;
    }
  }),
  undefineExecutor: action((state, payload) => {
    state.definitions.executors?.filter(
      (executor) => executor.name !== payload.name,
    );
  }),

  defineParameter: action((state, payload) => {
    state.definitions.parameters =
      state.definitions.parameters?.concat(payload);
  }),
  updateParameter: action((state, payload) => {}),
  undefineParameter: action((state, payload) => {
    state.definitions.parameters?.filter(
      (parameter) => parameter.name !== payload.name,
    );
  }),

  defineCommand: action((state, payload) => {
    state.definitions.commands = state.definitions.commands?.concat(payload);
  }),
  updateCommand: action((state, payload) => {}),
  undefineCommand: action((state, payload) => {
    state.definitions.commands?.filter(
      (command) => command.name !== payload.name,
    );
  }),

  error: action((state, payload) => {
    console.error('An action was not found! ', payload);
  }),

  generateConfig: action((state, payload) => {
    const workflows = state.workflows.map((flow) => {
      const jobs = flow.elements
        .filter((element) => element.type === JobMapping.type)
        .map((element) => element.data);

      return new Workflow(flow.name, jobs);
    });

    const defs = state.definitions;
    const config = new Config(
      false,
      payload?.jobs ? [...defs.jobs, ...payload.jobs] : defs.jobs,
      workflows,
      payload?.executors
        ? [...defs.executors, ...payload.executors]
        : defs.executors,
      payload?.commands
        ? [...defs.commands, ...payload.commands]
        : defs.commands,
      defs.parameters.length > 0
        ? new parameters.CustomParametersList<PipelineParameterLiteral>(
            payload?.parameters
              ? [...defs.parameters, ...payload.parameters]
              : defs.parameters,
          )
        : undefined,
    );

    if (payload) {
      state.editingConfig = config.stringify();
    } else {
      state.config = config.stringify();
      state.editingConfig = undefined;
    }
  }),
};

const Store: StoreModel & StoreActions = {
  selectedWorkflow: 0,
  editingConfig: undefined,
  config: undefined,
  navigation: {
    component: DefinitionsMenu,
    props: { expanded: [true, true, false, false] },
  },
  definitions: {
    commands: [],
    executors: [],
    jobs: [],
    workflows: [],
    parameters: [],
  },
  workflows: [
    {
      name: 'build-and-test',
      elements: [],
      id: v4(),
    },
  ],
  ...Actions,
};

export default Store;
