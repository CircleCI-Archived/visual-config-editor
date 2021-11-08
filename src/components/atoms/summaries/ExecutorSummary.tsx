import { ReusableExecutor } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Executor";

const ExecutorSummary: React.FunctionComponent<{ data: ReusableExecutor }> = (
  props,
) => {
  return (
    <div>
      {props.data.name}
    </div>
  );
};

export default ExecutorSummary;
