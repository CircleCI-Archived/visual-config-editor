import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Reusable';
import ExecutorIcon from '../../../icons/components/ExecutorIcon';

const ExecutorSummary: React.FunctionComponent<{ data: ReusableExecutor }> = (
  props,
) => {
  return (
    <div className="flex flex-row">
      <ExecutorIcon className="ml-1 mr-2 w-5 h-5" /> {props.data.name}
    </div>
  );
};

export default ExecutorSummary;
