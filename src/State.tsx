import { Workflow } from '@circleci/circleci-config-sdk';
import { CircleCIConfigObject, ConfigOrbImport } from '@circleci/circleci-config-sdk/dist/lib/Config';
import { PipelineParameter } from '@circleci/circleci-config-sdk/dist/lib/Config/Pipeline';
import { ParameterTypeLiteral } from '@circleci/circleci-config-sdk/dist/lib/Config/Pipeline/Parameters';
import { action } from 'easy-peasy';

export interface ModelTypes {
    config: CircleCIConfigObject;
    orbs: Array<ConfigOrbImport>;
    parameters: Array<PipelineParameter<ParameterTypeLiteral>>;
}

const State = (): ModelTypes => {
    return {
        config: {
            version: 2.1,
            commands: [],
            executors: [],
            jobs: [],
            workflows: [new Workflow("build-and-test", [])]
        },
        orbs: [],
        parameters: []
    }
}

export default State;