import { useStoreActions } from '../../../state/Hooks';
import { StepDefinitionMenuNav } from '../../menus/definitions/StepDefinitionMenu';
import { Button } from '../Button';
import { ListItemChildProps } from './ListProperty';

export type AdjacentStepLiteral = 'pre-steps' | 'post-steps';

const AdjacentStepListItem = ({
  item,
  index,
  values,
  type,
}: ListItemChildProps & { type: AdjacentStepLiteral }) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const commandName = Object.keys(item)[0];
  const commandValues = item[commandName];

  return (
    <Button
      title={commandName}
      ariaLabel={commandName}
      className="flex-1 cursor-pointer text-left rounded text-circle-black leading-6"
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
            getter: (values: any) => values.parameters[type],
            setter: (values: any, value: any) =>
              (values.parameters[type] = value),
            index,
          },
          values: {
            ...values,
          },
        });
      }}
    >
      {commandName}
    </Button>
  );
};

export default AdjacentStepListItem;
