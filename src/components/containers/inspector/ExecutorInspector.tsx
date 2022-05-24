import { FormikValues } from 'formik';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import { executorSubtypes } from './subtypes/ExecutorSubtypes';

const ExecutorInspector = (
  props: FormikValues & { definitions: DefinitionModel },
) => {
  return (
    <div>
      <InspectorProperty label="Name" name="name" required />
      <InspectorProperty
        label="Description"
        name={`${props.values.type}.parameters.description`}
        as="textarea"
      />
      <InspectorProperty
        label="Resource Class"
        name="resource_class"
        required
        as="select"
      >
        {executorSubtypes[props.values.type]?.resourceClasses?.map(
          (resourceClass) => (
            <option value={resourceClass} key={resourceClass}>
              {resourceClass}
            </option>
          ),
        )}
      </InspectorProperty>
      {executorSubtypes[props.values.type]?.fields}
      <InspectorProperty
        label="Shell"
        name={`${props.values.type}.parameters.shell`}
      />
      <InspectorProperty
        label="Working Directory"
        name={`${props.values.type}.parameters.working_directory`}
      />
    </div>
  );
};

export default ExecutorInspector;
