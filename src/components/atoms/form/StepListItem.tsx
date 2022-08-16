import { useStoreActions } from '../../../state/Hooks';
import { StepDefinitionMenuNav } from '../../menus/definitions/StepDefinitionMenu';
import { ListItemChildProps } from './ListProperty';

const StepListItem = ({ item, index, values }: ListItemChildProps) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const commandName = Object.keys(item)[0];
  const commandValues = item[commandName];

  return (
    <button
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
      {commandName}
    </button>
  );
};

export default StepListItem;
