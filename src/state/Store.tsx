import { Config, Executor, Job, Workflow } from '@circleci/circleci-config-sdk';
import { Command } from '@circleci/circleci-config-sdk/dist/lib/Components/Commands/Command';
import { DockerExecutor } from '@circleci/circleci-config-sdk/dist/lib/Components/Executor';
import { AbstractExecutor } from '@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor';
import { CircleCIConfigObject, ConfigOrbImport } from '@circleci/circleci-config-sdk/dist/lib/Config';
import { ParameterTypes } from '@circleci/circleci-config-sdk/dist/lib/Config/Parameters';
import { PipelineParameter } from '@circleci/circleci-config-sdk/dist/lib/Config/Pipeline';
import { Action, action } from 'easy-peasy';
import { Edge, Elements, FlowElement, getIncomers, getOutgoers, isEdge, isNode, Node, updateEdge } from 'react-flow-renderer';
import { v4 } from 'uuid';
import JobNode, { JobNodeProps as JobModel, JobNodeProps } from '../components/containers/nodes/JobNode'
import ConfigData from '../data/ConfigData';

export interface WorkflowModel {
  name: string
  id: string
  elements: Elements<any>
}

export interface DefinitionModel extends CircleCIConfigObject {
  orbs: ConfigOrbImport[];
  parameters: PipelineParameter<ParameterTypes>[];
}

export interface InspectModel {
  data?: any;
  dataType?: ConfigData | undefined;
  mode: 'creating' | 'editing' | 'none';
}

export interface StoreModel {
  config: Config | undefined;
  definitions: DefinitionModel;
  workflows: WorkflowModel[];
  inspecting: InspectModel;
  selectedWorkflow: number;
}

export interface UpdateType<T> {
  old: T
  new: T
}

export interface StoreActions {
  inspect: Action<StoreModel, InspectModel | undefined>;

  addWorkflow: Action<StoreModel, string>;
  selectWorkflow: Action<StoreModel, number>;
  removeWorkflow: Action<StoreModel, WorkflowModel>;

  addWorkflowElement: Action<StoreModel, FlowElement<any>>;
  removeWorkflowElement: Action<StoreModel, FlowElement<any>>;
  setWorkflowElements: Action<StoreModel, Elements<any>>

  // config/declarations
  importOrb: Action<StoreModel, ConfigOrbImport>;
  unimportOrb: Action<StoreModel, ConfigOrbImport>;

  defineJob: Action<StoreModel, Job>;
  updateJob: Action<StoreModel, UpdateType<Job>>;
  undefineJob: Action<StoreModel, Job>;

  defineCommand: Action<StoreModel, Command>;
  undefineCommand: Action<StoreModel, Command>;

  defineExecutor: Action<StoreModel, AbstractExecutor>;
  updateExecutor: Action<StoreModel, UpdateType<AbstractExecutor>>;
  undefineExecutor: Action<StoreModel, AbstractExecutor>;

  defineParameter: Action<StoreModel, PipelineParameter<ParameterTypes>>;
  undefineParameter: Action<StoreModel, PipelineParameter<ParameterTypes>>;

  generateConfig: Action<StoreModel>;
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
    state.workflows.push({ name, id: v4(), elements: [] });
  }),
  selectWorkflow: action((state, index) => {
    state.selectedWorkflow = index;
  }),
  removeWorkflow: action((state, payload) => {
    state.workflows.filter((workflow) => workflow.id !== payload.id)
  }),

  addWorkflowElement: action((state, payload) => {
    const workflow = state.workflows[state.selectedWorkflow];

    workflow.elements.push(payload);
  }),
  removeWorkflowElement: action((state, payload) => {

  }),
  setWorkflowElements: action((state, payload) => {
    state.workflows[state.selectedWorkflow].elements = payload;
  }),
  // config/declarations

  importOrb: action((state, payload) => {

  }),
  unimportOrb: action((state, payload) => {

  }),

  defineJob: action((state, payload) => {
    state.definitions.jobs?.push(payload);
  }),
  updateJob: action((state, payload) => {
    if (state.definitions.jobs) {
      const index = state.definitions.jobs.findIndex((job) => job.name === payload.old.name)

      state.workflows[0].elements = state.workflows[0].elements.map((e) =>
        isNode(e) && e.type === 'job' && e.data.job.name === payload.old.name ?
          { ...e, data: { ...e.data, job: payload.new } } : e
      );

      state.definitions.jobs[index] = payload.new;
    }
  }),
  undefineJob: action((state, payload) => {
    state.definitions.jobs?.filter((job) => job.name === payload.name)
  }),

  defineCommand: action((state, payload) => {

  }),
  undefineCommand: action((state, payload) => {

  }),

  defineExecutor: action((state, payload) => {
    state.definitions.executors?.push(payload);
  }),
  updateExecutor: action((state, payload) => {
    if (state.definitions.executors) {
      // const index = state.definitions.executors.findIndex((executor) => executor.name === payload.name)
      // state.definitions.executors[index] = payload;
    }
  }),
  undefineExecutor: action((state, payload) => {
    state.definitions.jobs?.filter((executor) => executor.name !== payload.name)
  }),

  defineParameter: action((state, payload) => {

  }),
  undefineParameter: action((state, payload) => {

  }),

  error: action((state, payload) => {
    console.error('An action was not found! ', payload)
  }),

  generateConfig: action((state) => {
    const defs = state.definitions;
    
    state.workflows.forEach((workflow) => {
      const elements = workflow.elements;

      // temp code. map traversal is limited by reactflow component. 
      // will look into alternatives later.

      const heads = [];

      elements.forEach((element) => {
        if (isNode(element)) {
          const incomers = getIncomers(element, elements) 

          if (incomers.length == 0) {
            heads.push(incomers);
          }
        }
      })

    })

    state.config = new Config(false, defs.jobs, defs.workflows, defs.executors)
  }),
}

const defaultExecutor = new Executor.DockerExecutor('default', 'cimg/base:stable')

const Store: StoreModel & StoreActions = {
  inspecting: { mode: 'none' },
  selectedWorkflow: 0,
  config: undefined,
  definitions: {
    version: 2.1,
    commands: [],
    executors: [defaultExecutor],
    jobs: [new Job('build', defaultExecutor), new Job('test', defaultExecutor), new Job('deploy', defaultExecutor)],
    workflows: [],
    orbs: [],
    parameters: []
  },
  workflows: [{ name: 'build-and-test', elements: [], id: v4() }],
  ...Actions
}


export default Store;