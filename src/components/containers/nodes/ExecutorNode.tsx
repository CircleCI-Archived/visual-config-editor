import { Handle, Node, Position, addEdge, Connection } from 'react-flow-renderer';
import Collapsible from 'react-collapsible';
import { Job } from '@circleci/circleci-config-sdk';
import { useCallback } from 'react-redux/node_modules/@types/react';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { anyExecutor } from '../../../data/ExecutorData';

const ExecutorNode: React.FunctionComponent<{ data: anyExecutor }> = (props) => {
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
        { props.data.name }
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

export default ExecutorNode;