import { FormikValues } from 'formik';
import JobMapping from '../../../mappings/JobMapping';
import { useStoreActions } from '../../../state/Hooks';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import ListProperty from '../../atoms/form/ListProperty';
import { StepDefinitionMenu } from '../../menus/definitions/StepDefinitionMenu';
import StepTypePage from '../../menus/definitions/subtypes/StepTypePage';
import { navSubTypeMenu } from '../../menus/SubTypeMenu';

const JobInspector = (
  props: FormikValues & { definitions: DefinitionModel },
) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const executor = props.values.executor;
  const executorName = typeof executor === 'string' ? executor : executor?.name;

  return (
    <div>
      <InspectorProperty label="Name" name="name" required />
      <InspectorProperty
        label="Executor"
        as="select"
        name="executor.name"
        value={executorName}
        required
      >
        {[{ name: 'Select Executor' }, ...props.definitions.executors].map(
          (executor) => (
            <option value={executor.name} key={executor.name}>
              {executor.name}
            </option>
          ),
        )}
      </InspectorProperty>
      <ListProperty
        label="Steps"
        name="steps"
        values={props.values}
        expanded
        required
        emptyText="No steps defined yet."
        titleExpanded={
          <button
            type="button"
            onClick={() => {
              navigateTo(
                navSubTypeMenu(
                  {
                    typePage: StepTypePage,
                    menuPage: StepDefinitionMenu,
                    passThrough: { dataType: JobMapping },
                    type: 'steps',
                  },
                  props.values,
                ),
              );
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

export default JobInspector;
