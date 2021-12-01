import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import ParameterIcon from '../../../icons/components/ParameterIcon';

const ParameterSummary: React.FunctionComponent<{
  data: CustomParameter<PipelineParameterLiteral>;
}> = (props) => {
  return (
    <div className="flex flex-row">
      <ParameterIcon className="ml-1 mr-2 w-5 h-5" /> {props.data.name}
    </div>
  );
};

export default ParameterSummary;
