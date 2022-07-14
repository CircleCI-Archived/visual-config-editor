import { parameters, parsers } from '@circleci/circleci-config-sdk';
import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import ParameterSummary from '../components/atoms/summaries/ParameterSummary';
import ParameterInspector from '../components/containers/inspector/ParameterInspector';
import { parameterSubtypes } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import ParameterTypePageNav from '../components/menus/definitions/subtypes/ParameterTypePage';
import ParameterIcon from '../icons/components/ParameterIcon';
import { DefinitionAction } from '../state/DefinitionStore';
import GenerableMapping from './GenerableMapping';

export const ParameterMapping: GenerableMapping<
  CustomParameter<PipelineParameterLiteral>
> = {
  type: 'parameters',
  name: {
    singular: 'Parameter',
    plural: 'Parameters',
  },
  defaults: {
    integer: {
      name: 'new_integer_parameter',
    },
    boolean: {
      name: 'new_boolean_parameter',
    },
    string: {
      name: 'new_string_parameter',
    },
    enum: {
      name: 'new_enum_parameter',
    },
  },
  transform: ({ name, ...values }) => {
    return parsers.parseParameter(
      values,
      name,
    ) as CustomParameter<PipelineParameterLiteral>;
  },
  store: {
    add: (actions) => actions.define_parameters,
    update: (actions) => actions.update_parameters,
    remove: (actions) => actions.delete_parameters,
  },
  subtypes: {
    component: ParameterTypePageNav,
    getSubtype: (parameter) => parameter.type,
    definitions: parameterSubtypes,
  },
  components: {
    icon: ParameterIcon,
    summary: ParameterSummary,
    inspector: ParameterInspector,
  },
  docsInfo: {
    description:
      'Options to help describe and expand functionality of a job, command, or executor.',
    link: 'https://circleci.com/docs/2.0/reusing-config/#using-the-parameters-declaration',
  },
};

export type ParameterAction = DefinitionAction<
  parameters.CustomParameter<PipelineParameterLiteral>
>;

export type ParameterActions = {
  define_parameters: ParameterAction;
  update_parameters: ParameterAction;
  delete_parameters: ParameterAction;
};
