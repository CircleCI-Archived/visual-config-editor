
import { ReusableCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Reusable';
import CommandIcon from '../../../icons/components/CommandIcon';

const CommandSummary: React.FunctionComponent<{ data: ReusableCommand }> = (
  props,
) => {
  return (
    <div className="flex flex-row">
      <CommandIcon className="mr-4 w-6 h-6" />
      <h3 className="my-auto">{props.data.name}</h3>
    </div>
  );
};

export default CommandSummary;
