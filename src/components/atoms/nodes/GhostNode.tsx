import React from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { WorkflowJob } from '../../../mappings/JobMapping';

const GhostNode: React.FunctionComponent<NodeProps & { data: WorkflowJob }> = (
  props,
) => {
  return (
    <div
      className={`p-2 w-40 h-12 bg-circle-gray-300 flex flex-row text-black rounded-md border cursor-pointer `}
    >
      <Handle type="target" hidden position={Position.Left} />
      <Handle type="source" hidden position={Position.Right} />
    </div>
  );
};

export default GhostNode;
