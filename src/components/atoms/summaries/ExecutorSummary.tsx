import { ReusableExecutor } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Executor";

const ExecutorSummary: React.FunctionComponent<{ data: ReusableExecutor }> = (
  props,
) => {
  return (
    <div>
      {props.data.name} {props.data.executor.resourceClass}
    </div>
  );
};

export default ExecutorSummary;
