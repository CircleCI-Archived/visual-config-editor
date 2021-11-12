import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PrimitiveParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/Parameters.types';
import { Field, Form, FormikValues } from 'formik';
import { DefinitionModel } from '../../../state/Store';
// data: CustomParameter<PrimitiveParameterLiteral>
const ParameterInspector = (props : FormikValues & { definitions: DefinitionModel }) => {
  return (
    <Form onSubmit={props.handleSubmit}>
      Name:{' '}
      <Field
        name="name"
        required
        className="p-1 w-full border-circle-light-blue border-2 rounded"
        value={props.values.name}
      />
    </Form>
  );
};

export default ParameterInspector;
