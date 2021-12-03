import { FormikValues } from 'formik';
import CommandMapping from '../../../mappings/CommandMapping';
import { useStoreActions } from '../../../state/Hooks';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import ListProperty from '../../atoms/form/ListProperty';
import StepPropertiesMenu from '../../menus/definitions/StepDefinitionMenu';
import StepTypePageNav from '../../menus/definitions/subtypes/StepTypePage';
import SubTypeMenuNav from '../../menus/SubTypeMenu';

const CommandInspector = (
  props: FormikValues & { definitions: DefinitionModel },
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
        values={props.values.steps}
        expanded
        required
        emptyText="No steps defined yet. At least one step is required."
        titleExpanded={
          <button
            type="button"
            onClick={() => {
              navigateTo({
                component: SubTypeMenuNav,
                props: {
                  typePage: StepTypePageNav,
                  menuPage: StepPropertiesMenu,
                  passThrough: { dataType: CommandMapping },
                },
                values: props.values,
              });
            }}
            className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
          >
            New
          </button>
        }
      ></ListProperty>
    </div>
  );
};

export default CommandInspector;
