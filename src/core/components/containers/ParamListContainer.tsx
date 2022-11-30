import { parameters } from '@circleci/circleci-config-sdk';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { Fragment } from 'react';
import { useStoreState } from '../../state/Hooks';
import { ExecutorProperty } from '../atoms/form/ExecutorProperty';
import InspectorProperty from '../atoms/form/InspectorProperty';
import { MatrixProperty } from '../atoms/form/MatrixProperty';

export type ParamListContainerProps = {
  paramList: parameters.CustomParametersList<AnyParameterLiteral>;
  parent?: string;
  props?: any;
  values?: any;
  matrix?: boolean;
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
      placeholder: parameter.defaultValue || 'No default value',
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
      placeholder: 'No default option',
    };
  },
  string: (parameter) => {
    return {
      placeholder: (parameter.defaultValue as string) || 'No default value',
    };
  },
  boolean: (parameter) => {
    return {
      type: 'checkbox',
    };
  },
  executor: (parameter) => {
    return {
      special: 'executor',
    };
  },
  steps: (parameter) => {
    return {};
  },
  env_var_name: (parameter) => {
    return {};
  },
};

const ParamListContainer = ({
  paramList,
  parent,
  values,
  matrix,
  ...props
}: ParamListContainerProps) => {
  const definitions = useStoreState((state) => state.definitions);

  return (
    <>
      {paramList.parameters.map((parameter, index) => {
        return (
          <Fragment key={index}>
            {parameter.type === 'executor' ? (
              <ExecutorProperty
                label={parameter.name}
                name={parameter.name}
                placeholder={parameter.defaultValue as string | undefined}
                required={parameter.defaultValue === undefined}
                orbPool={definitions.orbs}
                definitionPool={definitions.executors}
              />
            ) : matrix ? (
              <MatrixProperty
                {...props}
                label={parameter.name}
                values={values}
                namePrefix={parent}
                description={parameter.description}
                name={parameter.name}
                {...subtypes[parameter.type](parameter)}
              />
            ) : (
              <InspectorProperty
                {...props}
                label={parameter.name}
                description={parameter.description}
                values={values}
                name={parent ? `${parent}.${parameter.name}` : parameter.name}
                {...subtypes[parameter.type](parameter)}
                definitions={definitions}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default ParamListContainer;
