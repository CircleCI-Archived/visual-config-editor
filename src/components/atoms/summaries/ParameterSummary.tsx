import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import ParameterIcon from '../../../icons/components/ParameterIcon';

const ParameterSummary: React.FunctionComponent<{
  data: CustomParameter<PipelineParameterLiteral>;
}> = (props) => {
  return (
    <div className="flex flex-row">
      <ParameterIcon className="mr-4 w-6 h-6" />
      <h3 className="my-auto">{props.data.name}</h3>
    </div>
  );
};

export default ParameterSummary;
