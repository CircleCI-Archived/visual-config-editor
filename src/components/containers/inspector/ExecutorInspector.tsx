import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor";
import { ReactElement } from "react-redux/node_modules/@types/react";

const ExecutorInspector: React.FunctionComponent<{ data: AbstractExecutor }> = (props) => {
  return (
    <div>
      {/* {props.data.name} {props.data.executor.name} */}
    </div>
  )
}


export default ExecutorInspector;