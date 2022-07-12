import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Reusable';
import { SubTypeMapping } from '../../../../mappings/GenerableMapping';
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

const parameterSubtypes: ParameterTypes = {
  string: {
    text: 'String',
    description: `Sequence of characters that are optionally enlcosed by quotes.
      Empty strings are treated as falsey while in evaluation of when clauses, and non-empty strings are treated as truthy.`,
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
    description: `A Boolean represents a true/false value. Such as "on" or "off".`,

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
    description: `Integers can be formatted using the familiar decimal notation.
       Or have various formats such as having a leading “0x” to signal hexadecimal,
        a leading “0b” to indicate binary bits (base 2), or have leading “0” to signal an octal base.
        The use of “:” allows expressing integers in base 60, which is convenient for time/angle values.`,

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
    description: `Enums allow to define a list of any values,
       which are useful in the case to enforce that the value must be one from a specific set of string values`,

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

export { componentParametersSubtypes, parameterSubtypes };
