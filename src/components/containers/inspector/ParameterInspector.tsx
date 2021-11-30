import { FormikValues } from 'formik';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
// data: CustomParameter<PrimitiveParameterLiteral>
const ParameterInspector = (
  props: FormikValues & {
    definitions: DefinitionModel;
  },
) => {
  return (
    <div>
      <InspectorProperty name="name" label="Name" required />
    </div>
  );
};

export default ParameterInspector;
