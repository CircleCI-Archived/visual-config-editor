import { Job } from "@circleci/circleci-config-sdk";
import { FormikValues } from "formik";
import { DefinitionModel } from "../../../state/Store";

const JobInspector = (definitions: DefinitionModel) => ({
  values,
  handleChange,
  handleBlur,
  handleSubmit
}: FormikValues & { data: Job }) => {

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
      />
      <br />
      <select
        name="executor"
        value={values.executor}
        onChange={handleChange}
        onBlur={handleBlur}>
        <option value={'undefined'} key={'undefined'}>Select Executor</option>
        {definitions.executors?.map((executor) =>
          <option value={JSON.stringify(executor)} key={executor.name}>{executor.name}</option>
        )}
      </select>
      <button type="submit" className="p-1 font-bold text-white bg-circle-blue rounded-lg">
        Save
      </button>
    </form>
  )
}

export default JobInspector;