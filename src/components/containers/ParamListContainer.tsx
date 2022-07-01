import { parameters } from '@circleci/circleci-config-sdk';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import InspectorProperty from '../atoms/form/InspectorProperty';

export type ParamListContainerProps = {
  paramList: parameters.CustomParametersList<AnyParameterLiteral>;
  parent?: string;
};

type ParamInspector = {
  [K in AnyParameterLiteral]: (
    parameter: parameters.CustomParameter<AnyParameterLiteral>,
  ) => any;
};

const subtypes: ParamInspector = {
  integer: (parameter) => {
    return {
      className: 'w-full',
      type: 'number',
    };
  },
  enum: (parameter) => {
    const enumParam = parameter as parameters.CustomEnumParameter;

    return {
      as: 'select',
      className: 'w-full',
      children: enumParam.enumValues.map((value) => (
        <option value={value}>{value}</option>
      )),
    };
  },
  string: (parameter) => {
    return {
      placeholder: parameter.defaultValue as string,
    };
  },
  boolean: (parameter) => {
    return {
      type: 'checkbox',
    };
  },
  executor: (parameter) => {
    return {};
  },
  steps: (parameter) => {
    return {};
  },
  env_var_name: (parameter) => {
    return {};
  },
};

const ParamListContainer = ({ paramList, parent }: ParamListContainerProps) => {
  return (
    <>
      {paramList.parameters.map((parameter, index) => {
        return (
          <InspectorProperty
            label={parameter.name}
            key={index}
            name={parent ? `${parent}.${parameter.name}` : parameter.name}
            {...subtypes[parameter.type](parameter)}
          />
        );
      })}
    </>
  );
};

export default ParamListContainer;
