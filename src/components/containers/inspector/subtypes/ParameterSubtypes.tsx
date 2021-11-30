import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { ReactElement } from 'react';
import { SubTypeMapping } from '../../../../mappings/ComponentMapping';
import InspectorProperty from '../../../atoms/form/InspectorProperty';

export interface ComponentParameterType {
  types: string[];
}

export interface ParameterTypes {
  [key: string]: SubTypeMapping;
}

export interface ComponentParameterMapping {
  pipeline: ComponentParameterType;
  executor: ComponentParameterType;
  job: ComponentParameterType;
  command: ComponentParameterType;
}

const parameterTypes: ParameterTypes = {
  string: {
    text: 'String',
    description: 'Pass text data',
    fields: (
      <InspectorProperty
        name="defaultValue"
        as="textarea"
        label="Default Value"
      />
    ),
  },
  boolean: {
    text: 'Boolean',
    fields: (
      <InspectorProperty name="defaultValue" as="select" label="Default Value">
        <option value="undefined">No default</option>
        <option value="false">false</option>
        <option value="true">true</option>
      </InspectorProperty>
    ),
  },
  integer: {
    text: 'Integer',
    fields: (
      <InspectorProperty
        name="defaultValue"
        as="number"
        label="Default Value"
      />
    ),
  },
  enum: {
    text: 'Enum',
    fields: <input type="text" />,
  },
  executor: {
    text: 'Executor',
    fields: (props: { executors: ReusableExecutor[] }) => (
      <InspectorProperty
        label="Executor"
        as="select"
        name="executor.name"
        required
      >
        {props.executors?.map((executor) => (
          <option value={executor.name} key={executor.name}>
            {executor.name}
          </option>
        ))}
      </InspectorProperty>
    ),
  },
  steps: {
    text: 'Steps',
    fields: <input type="text" />,
  },
  env_var_name: {
    text: 'Environment Variable Name',
    fields: <input type="text" />,
  },
};

const componentParametersSubtypes: ComponentParameterMapping = {
  pipeline: {
    types: ['string', 'boolean', 'integer', 'enum'],
  },
  executor: { types: ['string', 'boolean', 'integer', 'enum'] },
  job: {
    types: [
      'string',
      'boolean',
      'integer',
      'enum',
      'executor',
      'steps',
      'env_var_name',
    ],
  },
  command: {
    types: ['string', 'boolean', 'integer', 'enum', 'steps', 'env_var_name'],
  },
};

export { componentParametersSubtypes, parameterTypes };
