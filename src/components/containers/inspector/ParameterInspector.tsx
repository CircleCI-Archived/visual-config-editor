import { FormikValues } from 'formik';
import { DefinitionsModel } from '../../../state/DefinitionStore';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import { parameterSubtypes } from './subtypes/ParameterSubtypes';

const ParameterInspector = (
  props: FormikValues & {
    definitions: DefinitionsModel;
    subtype?: string;
  },
) => {
  const fields = props.subtype
    ? parameterSubtypes[props.subtype]?.fields
    : undefined;

  return (
    <div>
      <InspectorProperty
        name="type"
        label="Type"
        hidden
        value={props.subtype}
      />
      <InspectorProperty name="name" label="Name" required />
      <InspectorProperty name="description" label="Description" as="textarea" />
      {fields && (typeof fields === 'function' ? fields(props) : fields)}
    </div>
  );
};

export default ParameterInspector;
