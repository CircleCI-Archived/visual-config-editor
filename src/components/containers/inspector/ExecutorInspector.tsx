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
      {/* <InspectorProperty
        label="Type"
        name="type"
        required
        as="select"
        onChange={props.handleChange}
      >
        {Object.keys(executorSubtypes).map((subtype) => (
          <option value={subtype} key={subtype}>
            {executorSubtypes[subtype].name}
          </option>
        ))}
      </InspectorProperty> */}
      <InspectorProperty
        label="Resource Class"
        name="executor.resourceClass"
        required
        as="select"
      >
        {executorSubtypes[props.values.subtype]?.resourceClasses?.map(
          (resourceClass) => (
            <option value={resourceClass} key={resourceClass}>
              {resourceClass}
            </option>
          ),
        )}
      </InspectorProperty>
      {executorSubtypes[props.values.subtype]?.fields}
    </div>
  );
};

export default ExecutorInspector;
