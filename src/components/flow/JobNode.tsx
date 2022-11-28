import { useEffect, useMemo } from 'react';
import { Handle, NodeProps, Position, ReactFlowState, useStore } from 'reactflow';
import JobIcon from '../../icons/components/JobIcon';
import { FlowMode } from '../../state/FlowStore';
import { useStoreState } from '../../state/Hooks';

const connectionNodeIdSelector = (state: ReactFlowState) => state.connectionNodeId;

export default function JobNode({ id, selected }: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const mode = useStoreState((state) => state.mode);

  const isTarget = connectionNodeId && connectionNodeId !== id;

  const label = isTarget ? 'Drop here' : 'Drag to connect';
  const nodeBase = "p-2 pr-3 text-sm bg-white node flex flex-row text-black rounded-md border cursor-pointer"
  const outline = selected ? "border-circle-blue" : " border-circle-gray-300"

  const Handles = useMemo(() => {
    const connectMode = mode == FlowMode.CONNECT;
    const handleBase = `${ connectMode ? '!w-full !h-full' : '!w-0 h-0'} !rounded opacity-0`
    const notConnecting = connectionNodeId == null

    return (
        <>
          <Handle
            className={`${handleBase} ${isTarget ? 'z-0' : !connectMode ? '-z-10' : 'z-10'}`}
            style={{transform: notConnecting ? 'translate(-5px, -50%)' : ''}}
            position={Position.Right}
            type="source"
          />
          <Handle
            className={`${handleBase} ${isTarget ? 'z-10' : !connectMode ? '-z-10' : 'z-0'}`}
            style={{transform: 'translate(4px, -50%)'}}
            position={Position.Left}
            type="target"
          />
        </>
    )

  }, [mode, connectionNodeId])

  return (
    <div className={`${nodeBase} ${outline} z-10`}>
        <JobIcon className="w-4 mr-2"/>
        {label}
        {Handles}
    </div>
  );
}
