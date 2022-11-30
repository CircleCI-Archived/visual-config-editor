import { FormikValues } from 'formik';
import CommandIcon from '../../../icons/components/CommandIcon';
import { CommandMapping } from '../../../../mappings/components/CommandMapping';
import { DefinitionsModel } from '../../../state/DefinitionStore';
import { useStoreActions } from '../../../state/Hooks';
import AddButton from '../../atoms/AddButton';
import { Empty } from '../../atoms/Empty';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import ListProperty from '../../atoms/form/ListProperty';
import StepListItem from '../../atoms/form/StepListItem';
import { StepDefinitionMenu } from '../../menus/definitions/StepDefinitionMenu';
import StepTypePageNav from '../../menus/definitions/subtypes/StepTypePage';
import { navSubTypeMenu } from '../../menus/SubTypeMenu';

const CommandInspector = (
  props: FormikValues & { definitions: DefinitionsModel },
) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <div>
      <InspectorProperty
        name="name"
        label="Name"
        required
        value={props.values.name}
      />
      <InspectorProperty name="description" label="Description" as="textarea" />
      <ListProperty
        label="Steps"
        name="steps"
        values={props.values}
        expanded
        required
        empty={
          <Empty
            label="No Steps Yet"
            Logo={CommandIcon}
            description={
              <>
                Add a step by clicking the button above.
                <br />
                At least one step is required.
              </>
            }
          />
        }
        listItem={StepListItem}
        pinned={
          <AddButton
            className='ml-auto flex'
            onClick={() => {
              navigateTo(
                navSubTypeMenu(
                  {
                    typePage: StepTypePageNav,
                    menuPage: StepDefinitionMenu,
                    passThrough: { dataType: CommandMapping },
                  },
                  props.values,
                ),
              );
            }}
          />
        }
      />
    </div>
  );
};

export default CommandInspector;
