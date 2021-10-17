import { Job } from '@circleci/circleci-config-sdk';
import { WorkflowJobParameters } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/Workflow';
import { addEdge, Connection, Handle, isNode, NodeProps, Position } from 'react-flow-renderer';
import { componentToType } from '../../../mappings/ConfigData';
import { WorkflowJob } from '../../../mappings/JobData';
import JobIcon from '../../../icons/JobIcon';
import { useStoreActions, useStoreState } from '../../../state/Hooks';

const JobNode: React.FunctionComponent<NodeProps & { data: WorkflowJob }> = (props) => {
  const elements = useStoreState((state) => state.workflows[state.selectedWorkflow].elements);
  const setWorkflowElements = useStoreActions((actions) => actions.setWorkflowElements);
  const updateJob = useStoreActions((actions) => actions.updateJob);

  const updateWorkflowJob = (workflowJob: WorkflowJob, applyToData: { job?: Job, parameters?: WorkflowJobParameters }) =>
    elements.map((element) =>
      isNode(element) && element.data.job.name === workflowJob.job.name ?
        { ...element, data: { ...workflowJob, ...applyToData } }
        : element
    );

  const onConnect = (params: Connection) => {
    const targetJob = elements.find((element) => element.id === params.target)?.data;

    setWorkflowElements(addEdge({ ...params, animated: false, style: { stroke: '#A3A3A3', strokeWidth: '2px' } },
      updateWorkflowJob(targetJob, {
        parameters: {
          requires: [props.data.job.name]
        }
      })));
  }

  return (
    <div className="p-3 bg-white text-black rounded-md border border-circle-gray-300"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('job')) {
          e.preventDefault();
        }
      }} onDrop={(e) => {
        if (e.dataTransfer.types.includes('job')) {

          const transfer: { type: string, data: any } = JSON.parse(e.dataTransfer.getData('job'));
          const type = componentToType(transfer.type)

          if (transfer && type?.applyToNode) {
            const applyToData = type.applyToNode(transfer.data, props.data);

            if ('job' in applyToData) {
              updateJob({ old: props.data.job, new: applyToData.job });
            }

            if ('parameters' in applyToData) {
              updateWorkflowJob(props.data, applyToData)
            }
          }
        }
      }} >
      <Handle type="target"
        isConnectable={true}
        onConnect={onConnect}
        position={Position.Left} style={{ borderRadius: 0 }} />
      <div className="flex w-40">
        <JobIcon className="w-6 h-6 mr-2" />
        {props.data.parameters?.name || props.data.job.name}
        {/* <p className="text-gray-200">
          Executor: {props.data.job.executor.name}
          <br />
          Parameters: {JSON.stringify(props.data.parameters) || 'None'}
        </p> */}
        {/* <p className="font-thin text-sm text-gray-600">
          Close
        </p> */}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        onConnect={onConnect}
        isConnectable={true}
      />
    </div >
  )
}

export default JobNode;