import ReactFlow, { Background, BackgroundVariant, ControlButton, Controls, MiniMap, ReactFlowProvider, useReactFlow } from "reactflow";
import { useStoreState } from "../../state/Hooks";

export type FlowProps = { className?: string }

const Flow = (props: FlowProps) => {
    // const reactFlowInstance = useReactFlow();
    const dragging = useStoreState((state) => state.dragging);

    return <ReactFlow
        minZoom={-Infinity}
        fitView
        // nodes={nodes}
        // edges={edges as Edge[]}
        // onNodeClick={handleNodeClick}
        className={props.className} 
        onDragOver={(e) => {
            if (dragging?.dataType?.dragTarget === 'workflow') {
            e.preventDefault();
            }
        }}
        onInit={(reactFlowInstance) => console.log('flow loaded:', reactFlowInstance)}
        >
        <Background
          gap={15}
          color="#c7c7c7"
          className="bg-circle-gray-200"
          size={2}  
        />
        <Controls>
        </Controls>
    </ReactFlow>
}

const GraphWrapper = (props: FlowProps) => {
    return <ReactFlowProvider>
        <Flow {...props} />
    </ReactFlowProvider>
}

export { GraphWrapper, Flow };