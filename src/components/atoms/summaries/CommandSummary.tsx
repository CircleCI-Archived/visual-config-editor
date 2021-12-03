import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Reusable';
import CommandIcon from '../../../icons/components/CommandIcon';

const CommandSummary: React.FunctionComponent<{ data: CustomCommand }> = (
  props,
) => {
  return (
    <div className="flex flex-row">
      <CommandIcon className="ml-1 mr-2 w-5 h-5"/> {props.data.name}
    </div>
  );
};

export default CommandSummary;
