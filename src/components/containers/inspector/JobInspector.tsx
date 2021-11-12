import { ArrayHelpers, Field, FormikValues } from 'formik';
import JobMapping from '../../../mappings/JobMapping';
import { useStoreActions } from '../../../state/Hooks';
import { DefinitionModel } from '../../../state/Store';
import ListProperty from '../../atoms/form/ListProperty';
import StepTypeMenu from '../../menus/StepTypeMenu';
import { commandSubtypes } from './subtypes/CommandSubtypes';

const JobInspector = (
  props: FormikValues & { definitions: DefinitionModel },
) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  console.log(props)

  return (
    <div>
      Name
      <Field
        className="p-1 w-full border-circle-blue-light border-2 rounded"
        name="name"
        value={props.values.name}
      />
      <br />
      Executor
      <Field
        name="executor.name"
        className="p-1 w-full border-circle-blue-light border-2 rounded"
        as="select"
      >
        <option value="undefined" key="undefined">
          Select Executor
        </option>
        {props.definitions.executors?.map((executor) => (
          <option value={executor.name} key={executor.name}>
            {executor.name}
          </option>
        ))}
      </Field>
      <ListProperty
        label="Steps"
        name="steps"
        values={props.values.steps}
        emptyText="No steps defined yet."
        titleExpanded={
          <button
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
      <br />
    </div>
  );
};

export default JobInspector;
