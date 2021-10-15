import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor";
import { FormikValues } from "formik";
import { DefinitionModel } from "../../../state/Store";

const ExecutorInspector = (definitions: DefinitionModel) => ({
  values,
  handleChange,
  handleBlur,
  handleSubmit
}: FormikValues & { data: AbstractExecutor}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
      />
      <button type="submit" className="p-1 font-bold text-white bg-circle-blue rounded-lg">
        Submit
      </button>
    </form>
  )
}


export default ExecutorInspector;