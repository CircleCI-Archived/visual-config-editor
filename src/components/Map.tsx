import React, { useState } from 'react';
import ReactFlow from 'react-flow-renderer';

interface ElementProps {
    items: [];
}

const Map: React.FC<ElementProps> = props => {

//   const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
//   const [elements, setElements] = useState<{}[]>([]);
  // const onElementsRemove = (elementsToRemove) =>
  // setElements((els) => removeElements(elementsToRemove, els));
  // const onConnect = (params) => setElements((els) => addEdge(params, els));
//   const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);
  
  return (
    <ReactFlow
      elements={props.items}
      // onElementsRemove={onElementsRemove}
      // onConnect={onConnect}
    //   onLoad={onLoad}
      selectNodesOnDrag={false}
    >
    </ReactFlow>
  );
};

export default Map;