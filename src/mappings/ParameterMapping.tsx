import { parameters } from '@circleci/circleci-config-sdk';
import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import ParameterSummary from '../components/atoms/summaries/ParameterSummary';
import ParameterInspector from '../components/containers/inspector/ParameterInspector';
import ParameterIcon from '../icons/components/ParameterIcon';
import ComponentMapping from './ComponentMapping';

const ParameterMapping: ComponentMapping<
  CustomParameter<PipelineParameterLiteral>
> = {
  type: 'parameter',
  name: {
    singular: 'Parameter',
    plural: 'Parameters',
  },
  defaults: {},
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
  components: {
    icon: ParameterIcon,
    summary: ParameterSummary,
    inspector: ParameterInspector,
  },
};

export default ParameterMapping;
