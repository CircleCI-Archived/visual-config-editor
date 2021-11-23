import { FormikValues } from 'formik';
import JobMapping from '../../../mappings/JobMapping';
import { useStoreActions } from '../../../state/Hooks';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import ListProperty from '../../atoms/form/ListProperty';
import StepTypeMenu from '../../menus/StepTypeMenu';

const JobInspector = (
  props: FormikValues & { definitions: DefinitionModel },
) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <div>
      <InspectorProperty label="Name" name="name" required />
      <InspectorProperty
        label="Executor"
        as="select"
        name="executor.name"
        required
      >
        {props.definitions.executors?.map((executor) => (
          <option value={executor.name} key={executor.name}>
            {executor.name}
          </option>
        ))}
      </InspectorProperty>
      <ListProperty
        label="Steps"
        name="steps"
        values={props.values.steps}
        expanded
        emptyText="No steps defined yet."
        titleExpanded={
          <button
            type="button"
            onClick={() => {
              navigateTo({
                component: StepTypeMenu,
                props: { dataType: JobMapping },
                values: props.values,
              });
            }}
            className="ml-auto tracking-wide leading-6 text-sm text-circle-blue font-medium"
          >
            New
          </button>
        }
      ></ListProperty>
    </div>
  );
};

export default JobInspector;
