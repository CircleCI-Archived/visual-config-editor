import { CustomParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters';
import { PrimitiveParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/Parameters.types';
import { Field, Form, FormikValues } from 'formik';
import { DefinitionModel } from '../../../state/Store';

const ParameterInspector =
  (definitions: DefinitionModel) =>
  ({
    values,
    handleChange,
    handleSubmit,
  }: FormikValues & { data: CustomParameter<PrimitiveParameterLiteral> }) => {
    return (
      <Form onSubmit={handleSubmit}>
        Name:{' '}
        <Field
          name="name"
          required
          className="p-1 w-full border-circle-light-blue border-2 rounded"
          value={values.name}
        />
      </Form>
    );
  };

export default ParameterInspector;
