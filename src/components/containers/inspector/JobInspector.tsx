import { FormikValues } from 'formik';
import JobMapping from '../../../mappings/JobMapping';
import { useStoreActions } from '../../../state/Hooks';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import ListProperty from '../../atoms/form/ListProperty';
import StepListItem from '../../atoms/form/StepListItem';
import { StepDefinitionMenu } from '../../menus/definitions/StepDefinitionMenu';
import StepTypePageNav from '../../menus/definitions/subtypes/StepTypePage';
import { navSubTypeMenu } from '../../menus/SubTypeMenu';

const getEmbeddedExecutor = (values: any) => {
  const executorKeys = ['machine', 'macos', 'docker'];

  return Object.keys(values).find((key) => executorKeys.includes(key));
};

const JobInspector = (
  props: FormikValues & { definitions: DefinitionModel },
) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const embeddedExecutor = getEmbeddedExecutor(props.values);

  return (
    <div>
      <InspectorProperty label="Name" name="name" required />
      {embeddedExecutor && (
        <button type="button">Embedded {embeddedExecutor} executor</button>
      )}
      <InspectorProperty
        label="Executor"
        as="select"
        name="executor.name"
        className="w-full"
        required
        value={
          embeddedExecutor
            ? 'Embedded {embeddedExecutor} executor'
            : props.values.executor.name
        }
        onChange={(e) => {
          if (embeddedExecutor) {
            delete props.values[embeddedExecutor];
          }
        }}
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
        listItem={StepListItem}
        emptyText="No steps defined yet."
        titleExpanded={
          <button
            type="button"
            onClick={() => {
              navigateTo(
                navSubTypeMenu(
                  {
                    typePage: StepTypePageNav,
                    menuPage: StepDefinitionMenu,
                    passThrough: { dataType: JobMapping },
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
