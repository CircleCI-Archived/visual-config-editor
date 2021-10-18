import { Field, FieldArray, Form, FormikValues } from "formik";
import { ReactElement } from "react";
import { ReusableExecutor } from "../../../mappings/ExecutorMapping";
import { DefinitionModel } from "../../../state/Store";

const ExecutorInspector = (definitions: DefinitionModel) => ({
  values,
  handleChange,
  handleSubmit
}: FormikValues & { data: ReusableExecutor }) => {
  const subtypes: {
    [K: string]: {
      name: string,
      fields: ReactElement,
      resourceClasses: string[]
    }
  } = {
    'docker': {
      name: 'Docker',
      resourceClasses: ['small', 'medium', 'medium+', 'large', 'xlarge', '2xlarge', '2xlarge+'],
      fields: (<div>
        Image: <Field required name="executor.image.image"></Field>
      </div>)
    },
    'machine': {
      name: 'Machine',
      resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
      fields: (<div>
        Image: <Field required name="executor.image"></Field>
      </div>)
    },
    'macos': {
      name: 'MacOS',
      resourceClasses: ['medium', 'large'],
      fields: (<div>
        Xcode: <Field required name="executor.xcode"></Field>
      </div>)
    },
    'windows': {
      name: 'Windows',
      resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
      fields: (<div>
        Image: <Field required name="executor.image"></Field>
      </div>)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      Name: <Field
        name="name"
        value={values.name}
      />
      <br />
      Executor Type: <Field name="type"
        as="select" >
        {Object.keys(subtypes).map((subtype) =>
          <option value={subtype} key={subtype}>{subtypes[subtype].name}</option>
        )}
      </Field>
      <br />
      Resource Class: <Field as="select" name="executor.resourceClass"
        onChange={handleChange}>
        {subtypes[values.type]?.resourceClasses?.map((resourceClass) =>
          <option value={resourceClass} key={resourceClass}>{resourceClass}</option>
        )}
      </Field>
      <br />
      {subtypes[values.type].fields}
      <br />
      <button type="submit" className="p-1 font-bold text-white bg-circle-blue rounded-lg">
        Submit
      </button>
    </Form>
  )
}


export default ExecutorInspector;