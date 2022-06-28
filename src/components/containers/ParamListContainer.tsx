import { parameters } from '@circleci/circleci-config-sdk';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import InspectorProperty from '../atoms/form/InspectorProperty';

export type ParamListContainerProps = {
  paramList: parameters.CustomParametersList<AnyParameterLiteral>;
};

type ParamInspector = {
  [K in AnyParameterLiteral]: (
    parameter: parameters.CustomParameter<AnyParameterLiteral>,
  ) => any;
};

const subtypes: ParamInspector = {
  integer: (parameter) => {
    return {
      className: 'w-20',
      as: 'number',
    };
  },
  enum: (parameter) => {
    const enumParam = parameter as parameters.CustomEnumParameter;

    return {
      as: 'select',
      children: enumParam.enumValues.map((value) => {
        <option value={value}>{value}</option>;
      }),
    };
  },
  string: (parameter) => {
    return {};
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

const ParamListContainer = ({ paramList }: ParamListContainerProps) => {
  return (
    <>
      {paramList.parameters.map((parameter) => {
        return (
          <InspectorProperty
            label={parameter.name}
            name={parameter.name}
            {...subtypes[parameter.type](parameter)}
            placeholder={
              parameter.type === 'string'
                ? (parameter.defaultValue as string)
                : undefined
            }
          />
        );
      })}
    </>
  );
};

export default ParamListContainer;
