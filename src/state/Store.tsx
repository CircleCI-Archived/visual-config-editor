import { Config, Job } from '@circleci/circleci-config-sdk';
import { Command } from '@circleci/circleci-config-sdk/dist/lib/Components/Commands/Command';
import { AbstractExecutor } from '@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor';
import { CircleCIConfigObject, ConfigOrbImport } from '@circleci/circleci-config-sdk/dist/lib/Config';
import { ParameterTypes } from '@circleci/circleci-config-sdk/dist/lib/Config/Parameters';
import { PipelineParameter } from '@circleci/circleci-config-sdk/dist/lib/Config/Pipeline';
import { Action, action } from 'easy-peasy';
import { Elements } from 'react-flow-renderer';
import { v4 } from 'uuid';
import { JobNodeProps as JobModel } from '../components/nodes/JobNode'

export interface WorkflowModel {
    name: string
    id: string
    jobNodes: Elements<JobModel>
}

export interface StoreModel {
    config: Config;
    definitions: CircleCIConfigObject;
    orbs: ConfigOrbImport[];
    parameters: PipelineParameter<ParameterTypes>[];
    workflows: WorkflowModel[]
}

export interface StoreActions {
    addWorkflow: Action<StoreModel, string>;
    removeWorkflow: Action<StoreModel, WorkflowModel>;
    addWorkflowJob: Action<StoreModel, JobModel>;
    removeWorkflowJob: Action<StoreModel, JobModel>;

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
    addWorkflow: action((state, name) => {
        state.workflows.push({ name, id: v4(), jobNodes: [] });
    }),
    removeWorkflow: action((state, payload) => {
        state.workflows.filter((workflow) => workflow.id !== payload.id)
    }),
    addWorkflowJob: action((state, payload) => {
    }),
    removeWorkflowJob: action((state, payload) => {

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

    }),
    undefineExecutor: action((state, payload) => {

    }),

    defineParameter: action((state, payload) => {

    }),
    undefineParameter: action((state, payload) => {

    }),
}

const Store: StoreModel & StoreActions = {
    config: new Config(),
    definitions: {
        version: 2.1,
        commands: [],
        executors: [],
        jobs: [],
        workflows: [],
    },
    workflows: [],
    orbs: [],
    parameters: [],
    ...Actions
}


export default Store;