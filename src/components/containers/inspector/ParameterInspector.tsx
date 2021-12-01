import { FormikValues } from 'formik';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import { parameterSubtypes } from './subtypes/ParameterSubtypes';
// data: CustomParameter<PrimitiveParameterLiteral>
const ParameterInspector = (
  props: FormikValues & {
    definitions: DefinitionModel;
  },
) => {
  return (
    <div>
      <InspectorProperty name="name" label="Name" required />
      <InspectorProperty name="description" label="Description" />
      {parameterSubtypes[props.values.type]?.fields}
    </div>
  );
};

export default ParameterInspector;
