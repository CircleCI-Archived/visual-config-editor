import { ReusableExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor';
import { Field, Form, FormikValues } from 'formik';
import { ReactElement } from 'react'; 
import { DefinitionModel } from '../../../state/Store';

const ExecutorInspector =
  (definitions: DefinitionModel, bindSubmitForm: (submitForm: () => void) => void) =>
  ({
    values,
    handleChange,
    handleSubmit,
  }: FormikValues & { data: ReusableExecutor }) => {
    bindSubmitForm(handleSubmit);

    const subtypes: {
      [K: string]: {
        name: string;
        fields: ReactElement;
        resourceClasses: string[];
      };
    } = {
      docker: {
        name: 'Docker',
        resourceClasses: [
          'small',
          'medium',
          'medium+',
          'large',
          'xlarge',
          '2xlarge',
          '2xlarge+',
        ],
        fields: (
          <div>
            Image
            <Field
              required
              name="executor.image.image"
              className="p-1 w-full border-circle-light-blue border-2 rounded"
            ></Field>
          </div>
        ),
      },
      machine: {
        name: 'Machine',
        resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
        fields: (
          <div>
            Image
            <Field
              required
              name="executor.image"
              className="p-1 w-full border-circle-light-blue border-2 rounded"
            ></Field>
          </div>
        ),
      },
      macos: {
        name: 'MacOS',
        resourceClasses: ['medium', 'large'],
        fields: (
          <div>
            Xcode
            <Field
              required
              name="executor.xcode"
              className="p-1 w-full border-circle-light-blue border-2 rounded"
            ></Field>
          </div>
        ),
      },
      windows: {
        name: 'Windows',
        resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
        fields: (
          <div>
            Image
            <Field
              required
              name="executor.image"
              className="p-1 w-full border-circle-light-blue border-2 rounded"
            ></Field>
          </div>
        ),
      },
    };

    return (
      <Form onSubmit={handleSubmit}>
        Name
        <Field
          name="name"
          required
          className="p-1 w-full border-circle-light-blue border-2 rounded"
          value={values.name}
        />
        <br />
        Executor Type
        <Field
          name="type"
          required
          className="p-1 w-full border-circle-light-blue border-2 rounded"
          as="select"
        >
          {Object.keys(subtypes).map((subtype) => (
            <option value={subtype} key={subtype}>
              {subtypes[subtype].name}
            </option>
          ))}
        </Field>
        <br />
        Resource Class
        <Field
          as="select"
          name="executor.resourceClass"
          className="p-1 w-full border-circle-light-blue border-2 rounded"
          onChange={handleChange}
        >
          {subtypes[values.type]?.resourceClasses?.map((resourceClass) => (
            <option value={resourceClass} key={resourceClass}>
              {resourceClass}
            </option>
          ))}
        </Field>
        <br />
        {subtypes[values.type]?.fields}
        <br />
      </Form>
    );
  };

export default ExecutorInspector;
