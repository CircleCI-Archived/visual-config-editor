import { Config, Job, Workflow } from '@circleci/circleci-config-sdk';
import { Command } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/Command';
import { ParameterTypes } from '@circleci/circleci-config-sdk/dist/src/lib/Config/Parameters';
import { PipelineParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Config/Pipeline';
import { Action, action } from 'easy-peasy';
import { Elements, FlowElement, isNode } from 'react-flow-renderer';
import { v4 } from 'uuid';
import ComponentMapping from '../mappings/ComponentMapping';
import { ReusableExecutor } from '../mappings/ExecutorMapping';

export interface WorkflowModel {
  name: string;
  id: string;
  elements: Elements<any>;
}

/** Reusable defintions of CircleCIConfigObject */
export interface DefinitionModel /*extends CircleCIConfigObject*/ {
  parameters: PipelineParameter<ParameterTypes>[];
  executors: ReusableExecutor[];
  jobs?: Job[];
  commands?: Command[];
  workflows?: Workflow[];
}

export interface InspectModel {
  data?: any;
  dataType?: ComponentMapping | undefined;
  values?: any;
  mode: 'creating' | 'editing' | 'none';
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
  /** Currently selected workflow pane index */
  selectedWorkflow: number;
}

export interface UpdateType<T> {
  old: T;
  new: T;
}

export interface StoreActions {
  inspect: Action<StoreModel, InspectModel | undefined>;

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
  // defineCommand: Action<StoreModel, Command>;
  // undefineCommand: Action<StoreModel, Command>;

  defineExecutor: Action<StoreModel, ReusableExecutor>;
  updateExecutor: Action<StoreModel, UpdateType<ReusableExecutor>>;
  undefineExecutor: Action<StoreModel, ReusableExecutor>;

  /** @todo implement parameters */
  // defineParameter: Action<StoreModel, PipelineParameter<ParameterTypes>>;
  // undefineParameter: Action<StoreModel, PipelineParameter<ParameterTypes>>;

  generateConfig: Action<StoreModel, Config>;
  error: Action<StoreModel, any>;
}

const Actions: StoreActions = {
  inspect: action((state, payload) => {
    state.inspecting = {
      mode: 'none',
      data: undefined,
      dataType: undefined,
      ...payload,
    };
  }),

  addWorkflow: action((state, name) => {
    state.workflows = state.workflows.concat({ name, id: v4(), elements: [] });
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
    state.definitions.jobs?.filter(
      (executor) => executor.name !== payload.name,
    );
  }),

  // defineParameter: action((state, payload) => {}),
  // undefineParameter: action((state, payload) => {}),

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
  definitions: {
    commands: [],
    executors: [],
    jobs: [],
    workflows: [],
    parameters: [],
  },
  workflows: [{ name: 'build-and-test', elements: [], id: v4() }],
  ...Actions,
};

export default Store;
