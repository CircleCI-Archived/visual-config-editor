import { parameters } from '@circleci/circleci-config-sdk';
import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import ParameterSummary from '../components/atoms/summaries/ParameterSummary';
import ParameterInspector from '../components/containers/inspector/ParameterInspector';
import { parameterSubtypes } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import ParameterTypePageNav from '../components/menus/definitions/subtypes/ParameterTypePage';
import ParameterIcon from '../icons/components/ParameterIcon';
import ComponentMapping from './ComponentMapping';

const ParameterMapping: ComponentMapping<
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
  transform: (values: any) =>
    new parameters.CustomParameter(
      values.name,
      values.type,
      values.defaultValue,
      values.description,
    ),
  store: {
    get: (state) => state.definitions.parameters,
    add: (actions) => actions.defineParameter,
    update: (actions) => actions.updateParameter,
    remove: (actions) => actions.undefineParameter,
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
    description: 'Options to help describe a job, command, or executor',
    link: 'https://circleci.com/docs/2.0/reusing-config/#using-the-parameters-declaration',
  },
};

export default ParameterMapping;
