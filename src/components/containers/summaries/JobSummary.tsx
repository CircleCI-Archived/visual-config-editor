import { Job } from "@circleci/circleci-config-sdk";
import JobData from "../../../data/JobData";
import Definition from "../../atoms/Definition";

const JobSummary: React.FunctionComponent<{ data: Job }> = (props) => {
  return (
    <div> 
      {props.data.name} {props.data.executor?.name}
    </div>
  )
}

export default JobSummary;