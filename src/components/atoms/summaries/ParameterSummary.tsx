import { CustomParameter } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters";
import { PrimitiveParameterLiteral } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/Parameters.types";

const ParameterSummary: React.FunctionComponent<{ data: CustomParameter<PrimitiveParameterLiteral> }> = (
  props,
) => {
  return (
    <div>
      {props.data.name}
    </div>
  );
};

export default ParameterSummary;
