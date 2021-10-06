import { Executor, Job } from "@circleci/circleci-config-sdk";
import { Formik } from "formik";
import { useStoreActions } from "../../../state/Hooks";

const JobInspector: React.FunctionComponent<{ data: Job }> = (props) => {
  const defineJob = useStoreActions((actions) => actions.defineJob )

  return (
    <div>
      <Formik initialValues={{ name: 'New Job', executor: new Executor.DockerExecutor('test', 'image') }}
        onSubmit={(values) => {
          defineJob(new Job(values.name, values.executor))
        }}>{({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
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
        )}
      </Formik>
    </div>
  )
}


export default JobInspector;