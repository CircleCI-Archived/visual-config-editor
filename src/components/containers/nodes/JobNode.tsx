import { Handle, Node, Position, addEdge, Connection } from 'react-flow-renderer';
import Collapsible from 'react-collapsible';
import { Job } from '@circleci/circleci-config-sdk';
import { useCallback } from 'react-redux/node_modules/@types/react';
import { useStoreActions, useStoreState } from '../../../state/Hooks';

export interface JobNodeProps {
  parameters: any
  job: Job
}

const JobNode: React.FunctionComponent<{ data: JobNodeProps }> = (props) => {
  const elements = useStoreState((state) => state.workflows[0].elements);
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
          Executor: { props.data.job.executor.name }
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