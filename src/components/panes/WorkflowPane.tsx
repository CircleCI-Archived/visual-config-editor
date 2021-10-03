import React, { useState } from 'react';
import ReactFlow, { Background, BackgroundVariant, Elements } from 'react-flow-renderer';
import JobNode, { JobNodeProps } from '../nodes/JobNode';

interface ElementProps {
  items: Elements<JobNodeProps>;
  className?: string;
  bgClassName?: string;
}

const WorkflowPane = (props: ElementProps) => {
  return (
    <ReactFlow elements={props.items} className={props.className} selectNodesOnDrag={false} nodeTypes={{ job: JobNode }}
    >
      <Background variant={BackgroundVariant.Lines} gap={150} color="#000000" className={props.bgClassName} size={1}
      />
    </ReactFlow >
  );
};

export default WorkflowPane;