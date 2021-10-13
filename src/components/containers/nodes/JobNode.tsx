import { Handle, Node, Position, addEdge, Connection, NodeProps } from 'react-flow-renderer';
import Collapsible from 'react-collapsible';
import { Job } from '@circleci/circleci-config-sdk';
import { useCallback } from 'react-redux/node_modules/@types/react';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { WorkflowJobParameters } from '@circleci/circleci-config-sdk/dist/lib/Components/Workflow/Workflow';
import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/lib/Components/Workflow/WorkflowJob';

const JobNode: React.FunctionComponent< NodeProps & { data: WorkflowJob }> = (props) => {
  const elements = useStoreState((state) => state.workflows[state.selectedWorkflow].elements);
  const setWorkflowElements = useStoreActions((actions) => actions.setWorkflowElements);

  const onConnect = (params: Connection) => {


    setWorkflowElements(addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, elements))
  }

  return (
    <div className="p-3 bg-green-600 text-white font-bold rounded-lg">
      <Handle type="target" id="requires"
        isConnectable={true}
        onConnect={onConnect}
        position={Position.Left} style={{ borderRadius: 0 }} />
      <div className="flex-col flex w-full">
        {props.data.parameters.name || props.data.job.name}
        <p className="text-gray-200">
          Executor: {props.data.job.executor.name}
        </p>
        {/* <p className="font-thin text-sm text-gray-600">
          Close
        </p> */}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        onConnect={onConnect}
        isConnectable={true}
        id="requiredBy"
      />
    </div>
  )
}

export default JobNode;