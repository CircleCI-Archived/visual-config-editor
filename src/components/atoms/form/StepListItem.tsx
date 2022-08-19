import { useStoreActions } from '../../../state/Hooks';
import { StepDefinitionMenuNav } from '../../menus/definitions/StepDefinitionMenu';
import { Button } from '../Button';
import { ListItemChildProps } from './ListProperty';

const StepListItem = ({ item, index, values }: ListItemChildProps) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const commandName = typeof item === 'string' ? item : Object.keys(item)[0];
  const commandValues =
    typeof item === 'object' ? item[commandName] : undefined;
  const resolvedCommandName = commandValues && 'name' in commandValues ? commandValues.name: commandName
  return (
    <Button
      title={resolvedCommandName}
      ariaLabel={resolvedCommandName}
      className="flex-1 cursor-pointer rounded text-left text-circle-black leading-6"
      type="button"
      onClick={() => {
        navigateTo({
          component: StepDefinitionMenuNav,
          props: {
            editing: true,
            values: {
              name: commandName,
              parameters: commandValues,
            },
            index,
          },
          values,
        });
      }}
    >
      {resolvedCommandName}
    </Button>
  );
};

export default StepListItem;
