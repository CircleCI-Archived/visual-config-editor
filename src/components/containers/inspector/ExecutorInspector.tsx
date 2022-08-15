import { FormikValues } from 'formik';
import { DefinitionsModel } from '../../../state/DefinitionStore';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import { executorSubtypes } from './subtypes/ExecutorSubtypes';

const ExecutorInspector = (
  props: FormikValues & {
    definitions: DefinitionsModel;
    subtype?: string;
  },
) => {
  if (!props.subtype) {
    return <p>Something went wrong!</p>;
  }

  return (
    <>
      <InspectorProperty label="Name" name="name" required />
      <InspectorProperty
        label="Description"
        name={`description`}
        as="textarea"
      />
      <InspectorProperty
        label="Resource Class"
        name="resource_class"
        required
        as="select"
      >
        {executorSubtypes[props.subtype]?.resourceClasses?.map(
          (resourceClass: any) => (
            <option value={resourceClass} key={resourceClass} className='w-min'>
              {resourceClass}
            </option>
          ),
        )}
      </InspectorProperty>
      {executorSubtypes[props.subtype]?.fields}
      <InspectorProperty label="Shell" name={`shell`} />
      <InspectorProperty label="Working Directory" name={`working_directory`} />
    </>
  );
};

export default ExecutorInspector;
