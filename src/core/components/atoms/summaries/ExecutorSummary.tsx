import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Reusable';
import ExecutorIcon from '../../../icons/components/ExecutorIcon';

const ExecutorSummary: React.FunctionComponent<{ data: ReusableExecutor }> = (
  props,
) => {
  return (
    <div className="flex flex-row ">
      <ExecutorIcon className="mr-4 w-6 h-6" />
      <h3 className="my-auto">{props.data.name}</h3>
    </div>
  );
};

export default ExecutorSummary;
