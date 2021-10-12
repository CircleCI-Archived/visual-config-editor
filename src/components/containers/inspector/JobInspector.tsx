import { Job } from "@circleci/circleci-config-sdk";
import { FormikValues } from "formik";
import { useStoreState } from "../../../state/Hooks";

const JobInspector = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit
}: FormikValues & { data: Job }) => {
  const executors = useStoreState((state) => state.definitions.executors)

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
      />
      <br />
      {console.log(values.executor)}
      <select
        name="executor"
        value={values.executor}
        onChange={handleChange}
        onBlur={handleBlur}>
        <option value={'undefined'} key={'undefined'}>Select Executor</option>
        {executors?.map((executor) =>
          <option value={JSON.stringify(executor)} key={executor.name}>{executor.name}</option>
        )}
      </select>
      <button type="submit" className="p-1 font-bold text-white bg-circle-blue rounded-lg">
        Submit
      </button>
    </form>
  )
}


export default JobInspector;