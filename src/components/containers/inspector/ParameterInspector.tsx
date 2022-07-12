import { FormikValues } from 'formik';
import { DefinitionsModel } from '../../../state/DefinitionStore';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import { parameterSubtypes } from './subtypes/ParameterSubtypes';
// data: CustomParameter<PrimitiveParameterLiteral>
const ParameterInspector = (
  props: FormikValues & {
    definitions: DefinitionsModel;
    subtype?: string;
  },
) => {
  return (
    <div>
      <InspectorProperty
        name="type"
        label="Type"
        hidden
        value={props.subtype}
      />
      <InspectorProperty name="name" label="Name" required />
      <InspectorProperty name="description" label="Description" />
      {props.subtype && parameterSubtypes[props.subtype]?.fields}
    </div>
  );
};

export default ParameterInspector;
