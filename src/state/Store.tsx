import { Config, Job } from '@circleci/circleci-config-sdk';
import { Command } from '@circleci/circleci-config-sdk/dist/lib/Components/Commands/Command';
import { AbstractExecutor } from '@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor';
import { CircleCIConfigObject, ConfigOrbImport } from '@circleci/circleci-config-sdk/dist/lib/Config';
import { ParameterTypes } from '@circleci/circleci-config-sdk/dist/lib/Config/Parameters';
import { PipelineParameter } from '@circleci/circleci-config-sdk/dist/lib/Config/Pipeline';
import { Action, action } from 'easy-peasy';
import { Edge, Elements, FlowElement, Node } from 'react-flow-renderer';
import { v4 } from 'uuid';
import { JobNodeProps as JobModel } from '../components/containers/nodes/JobNode'
import ConfigData from '../data/ConfigData';

export interface WorkflowModel {
  name: string
  id: string
  elements: Elements<FlowElement>
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
  config: Config;
  definitions: DefinitionModel;
  workflows: WorkflowModel[];
  inspecting: InspectModel;
}

export interface StoreActions {
  inspect: Action<StoreModel, InspectModel>;

  addWorkflow: Action<StoreModel, string>;
  removeWorkflow: Action<StoreModel, WorkflowModel>;
  
  addWorkflowElement: Action<StoreModel, FlowElement<any>>;
  removeWorkflowElement: Action<StoreModel, FlowElement<any>>;
  setWorkflowElements: Action<StoreModel, Elements<any>>

  // config/declarations
  importOrb: Action<StoreModel, ConfigOrbImport>;
  unimportOrb: Action<StoreModel, ConfigOrbImport>;

  defineJob: Action<StoreModel, Job>;
  undefineJob: Action<StoreModel, Job>;

  defineCommand: Action<StoreModel, Command>;
  undefineCommand: Action<StoreModel, Command>;

  defineExecutor: Action<StoreModel, AbstractExecutor>;
  undefineExecutor: Action<StoreModel, AbstractExecutor>;

  defineParameter: Action<StoreModel, PipelineParameter<ParameterTypes>>;
  undefineParameter: Action<StoreModel, PipelineParameter<ParameterTypes>>;
}

const Actions: StoreActions = {
  inspect: action((state, payload) => {
    state.inspecting = payload;
    console.log(state.inspecting)
  }),

  addWorkflow: action((state, name) => {
    state.workflows.push({ name, id: v4(), elements: [] });
  }),
  removeWorkflow: action((state, payload) => {
    state.workflows.filter((workflow) => workflow.id !== payload.id)
  }),
  
  addWorkflowElement: action((state, payload) => {
    state.workflows[0].elements.push(payload);
  }),
  removeWorkflowElement: action((state, payload) => {
    
  }),
  setWorkflowElements: action((state, payload) => {
    state.workflows[0].elements = payload;
  }),
  // config/declarations

  importOrb: action((state, payload) => {

  }),
  unimportOrb: action((state, payload) => {

  }),

  defineJob: action((state, payload) => {
    state.definitions.jobs?.push(payload);
  }),
  undefineJob: action((state, payload) => {
    state.definitions.jobs?.filter((job) => job.name !== payload.name)
  }),

  defineCommand: action((state, payload) => {

  }),
  undefineCommand: action((state, payload) => {

  }),

  defineExecutor: action((state, payload) => {
    state.definitions.executors?.push(payload);
  }),
  undefineExecutor: action((state, payload) => {
    state.definitions.jobs?.filter((executor) => executor.name !== payload.name)
  }),

  defineParameter: action((state, payload) => {

  }),
  undefineParameter: action((state, payload) => {

  }),
}

const Store: StoreModel & StoreActions = {
  inspecting: { mode: 'none' },
  config: new Config(),
  definitions: {
    version: 2.1,
    commands: [],
    executors: [],
    jobs: [],
    workflows: [],
    orbs: [],
    parameters: []
  },
  workflows: [],
  ...Actions
}


export default Store;