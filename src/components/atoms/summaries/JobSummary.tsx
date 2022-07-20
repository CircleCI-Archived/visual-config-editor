import { Job } from '@circleci/circleci-config-sdk';
import JobIcon from '../../../icons/components/JobIcon';
import WorkflowIcon from '../../../icons/components/WorkflowIcon';
import { useStoreState } from '../../../state/Hooks';

const JobSummary: React.FunctionComponent<{ data: Job }> = (props) => {
  const stagedJobMap = useStoreState((state) => state.stagedJobs);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const stagedJobs = stagedJobMap.workflows[selectedWorkflow];

  return (
    <div className="flex flex-row">
      <JobIcon className="ml-1 mr-2 w-5 h-5" />
      <p className="leading-5">{props.data.name}</p>
      {stagedJobs && (
        <WorkflowIcon
          className="w-5 h-5 ml-auto"
          color={props.data.name in stagedJobs ? '#048C43' : '#E3E3E3'}
        />
      )}
    </div>
  );
};

export default JobSummary;
