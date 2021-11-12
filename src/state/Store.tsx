import { Config, Job, Workflow } from '@circleci/circleci-config-sdk';
import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/Reusable';
import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor';
import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PrimitiveParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/Parameters.types';
import { Action, action } from 'easy-peasy';
import {
  Elements,
  FlowElement,
  FlowTransform,
  isNode,
} from 'react-flow-renderer';
import { v4 } from 'uuid';
import DefinitionsMenu from '../components/menus/definitions/DefinitionsMenu';
import ComponentMapping from '../mappings/ComponentMapping';

export interface WorkflowModel {
  name: string;
  id: string;
  transform: FlowTransform;
  elements: Elements<any>;
}

/** Reusable definitions of CircleCIConfigObject */
export interface DefinitionModel /*extends CircleCIConfigObject*/ {
  parameters: CustomParameter<PrimitiveParameterLiteral>[];
  executors: ReusableExecutor[];
  jobs: Job[];
  commands: CustomCommand[];
  workflows: Workflow[];
}

export interface DataModel {
  data?: any;
  dataType?: ComponentMapping;
}

export interface InspectModel extends DataModel {
  values?: any;
  mode: 'creating' | 'editing' | 'none';
}

export interface NavigationModel extends NavigationStop {
  from?: NavigationModel;
  jumpedFrom?: NavigationStop;
}

export interface NavigationStop {
  component: React.FunctionComponent<any>;
  props: any;
}

export interface StoreModel {
  /** Last generated configuration */
  config: Config | undefined;
  /** Last generated configuration */
  definitions: DefinitionModel;
  /** Array of workflow panes */
  workflows: WorkflowModel[];
  /** Instance of inspector */
  inspecting: InspectModel;
  /** Order of components and the  */
  navigation: NavigationModel;
  /**  */
  dragging?: DataModel;
  /** Currently selected workflow pane index */
  selectedWorkflow: number;
}

export interface UpdateType<T> {
  old: T;
  new: T;
}

export interface StoreActions {
  setDragging: Action<StoreModel, DataModel | undefined>;

  navigateTo: Action<StoreModel, NavigationStop & { values?: any }>;
  navigateBack: Action<StoreModel, { distance?: number; apply?: (values: any) => any } | void>;

  addWorkflow: Action<StoreModel, string>;
  selectWorkflow: Action<StoreModel, number>;
  removeWorkflow: Action<StoreModel, WorkflowModel>;

  addWorkflowElement: Action<StoreModel, FlowElement<any>>;
  removeWorkflowElement: Action<StoreModel, FlowElement<any>>;
  setWorkflowElements: Action<StoreModel, Elements<any>>;
  setWorkflowTransform: Action<StoreModel, FlowTransform>;

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
    CustomParameter<PrimitiveParameterLiteral>
  >;
  updateParameter: Action<
    StoreModel,
    UpdateType<CustomParameter<PrimitiveParameterLiteral>>
  >;
  undefineParameter: Action<
    StoreModel,
    CustomParameter<PrimitiveParameterLiteral>
  >;

  generateConfig: Action<StoreModel, Config>;
  error: Action<StoreModel, any>;
}

const Actions: StoreActions = {
  navigateTo: action((state, payload) => {
    console.log(payload.values);
    state.navigation = {
      ...payload,
      from: {
        ...state.navigation,
        props: { ...state.navigation.props, values: payload.values },
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
          console.error('Tried to navigate back to a undefined component!');
          break;
        }
      }

      state.navigation = {
        ...travelTo,
        props: { ...travelTo.props, values: payload?.apply?.(travelTo.props.values) },
        jumpedFrom: state.navigation,
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
      transform: { x: 0, y: 0, zoom: 1 },
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
  setWorkflowTransform: action((state, payload) => {
    state.workflows[state.selectedWorkflow].transform = payload;
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
    state.definitions.jobs?.filter(
      (executor) => executor.name !== payload.name,
    );
  }),

  defineParameter: action((state, payload) => {}),
  updateParameter: action((state, payload) => {}),
  undefineParameter: action((state, payload) => {}),

  defineCommand: action((state, payload) => {}),
  updateCommand: action((state, payload) => {}),
  undefineCommand: action((state, payload) => {}),

  error: action((state, payload) => {
    console.error('An action was not found! ', payload);
  }),

  generateConfig: action((state, payload) => {
    state.config = payload;
  }),
};

const Store: StoreModel & StoreActions = {
  inspecting: { mode: 'none' },
  selectedWorkflow: 0,
  config: undefined,
  navigation: {
    component: DefinitionsMenu,
    props: {},
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
      transform: { x: 0, y: 0, zoom: 1 },
    },
  ],
  ...Actions,
};

export default Store;
