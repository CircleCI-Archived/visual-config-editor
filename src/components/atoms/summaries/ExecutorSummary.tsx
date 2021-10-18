import { ReusableExecutor } from '../../../mappings/ExecutorMapping';

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
