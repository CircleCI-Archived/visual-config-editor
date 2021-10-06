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
      <Collapsible trigger={props.data.parameters.name || props.data.job.name} triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
        <Collapsible trigger={props.data.parameters.toString()} triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
          <p>test</p>
        </Collapsible>
      </Collapsible>
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