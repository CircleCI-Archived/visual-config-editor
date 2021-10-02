import React, { useState } from 'react';
import ReactFlow, { Background, BackgroundVariant } from 'react-flow-renderer';
import JobNode from '../nodes/JobNode';

interface ElementProps {
  items: [];
  className?: string;
  bgClassName?: string;
}

const WorkflowPane = (props: ElementProps) => {

  //   const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  //   const [elements, setElements] = useState<{}[]>([]);
  // const onElementsRemove = (elementsToRemove) =>
  // setElements((els) => removeElements(elementsToRemove, els));
  // const onConnect = (params) => setElements((els) => addEdge(params, els));
  //   const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);

  return (
    <ReactFlow
      elements={props.items}
      className={props.className}
      // onElementsRemove={onElementsRemove}
      // onConnect={onConnect}
      //   onLoad={onLoad}
      selectNodesOnDrag={false}
      nodeTypes={{ job: JobNode }}
    >
      <Background
        variant={BackgroundVariant.Lines}
        gap={150}
        color="#000000"
        className={props.bgClassName}
        size={1}
      />
    </ReactFlow >
  );
};

export default WorkflowPane;