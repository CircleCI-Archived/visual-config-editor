import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/Reusable';
import { Field, Form, FormikValues } from 'formik';
import { DefinitionModel } from '../../../state/Store';

const CommandInspector =
  (definitions: DefinitionModel) =>
  ({
    values,
    handleChange,
    handleSubmit,
  }: FormikValues & { data: CustomCommand }) => {
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

export default CommandInspector;
