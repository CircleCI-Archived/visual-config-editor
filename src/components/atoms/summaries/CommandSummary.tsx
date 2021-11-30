import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Reusable';

const CommandSummary: React.FunctionComponent<{ data: CustomCommand }> = (
  props,
) => {
  return (
    <div>
      {props.data.name}
    </div>
  );
};

export default CommandSummary;
