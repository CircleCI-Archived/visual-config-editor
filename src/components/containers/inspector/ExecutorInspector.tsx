import { Job } from "@circleci/circleci-config-sdk";
import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor";
import { FormikValues } from "formik";
import { ReactElement } from "react-redux/node_modules/@types/react";

const ExecutorInspector = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit
}: FormikValues & { data: AbstractExecutor}) => {
  // const defineJob = useStoreActions((actions) => actions.defineJob)

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