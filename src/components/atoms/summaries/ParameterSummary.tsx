import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';

const ParameterSummary: React.FunctionComponent<{
  data: CustomParameter<PipelineParameterLiteral>;
}> = (props) => {
  return <div>{props.data.name}</div>;
};

export default ParameterSummary;
