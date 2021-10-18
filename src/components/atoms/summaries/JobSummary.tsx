import { Job } from '@circleci/circleci-config-sdk';

const JobSummary: React.FunctionComponent<{ data: Job }> = (props) => {
  return <div>{props.data.name}</div>;
};

export default JobSummary;
