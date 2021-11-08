import { Job } from '@circleci/circleci-config-sdk';
import JobIcon from '../../../icons/JobIcon';
import WorkflowIcon from '../../../icons/WorkflowIcon';

const JobSummary: React.FunctionComponent<{ data: Job }> = (props) => {
  return (
    <div className="flex flex-row">
      <JobIcon className="ml-1 mr-2 w-5 h-5"/>
      <p className="leading-5">{props.data.name}</p>
      <WorkflowIcon className="w-5 h-5 ml-auto" fill="#E3E3E3" />
    </div>
  );
};

export default JobSummary;
