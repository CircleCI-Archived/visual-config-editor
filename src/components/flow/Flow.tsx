import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider, useReactFlow } from "react-flow-renderer";
import { useStoreState } from "../../state/Hooks";

export type FlowProps = { className?: string }

const Flow = (props: FlowProps) => {
    const reactFlowInstance = useReactFlow();
    const dragging = useStoreState((state) => state.dragging);

    return <ReactFlow   
        className={props.className} 
        onDragOver={(e) => {
            if (dragging?.dataType?.dragTarget === 'workflow') {
            e.preventDefault();
            }
        }}>
        <Background
          variant={BackgroundVariant.Dots}
          gap={15}
          color="#c7c7c7"
          className="bg-circle-gray-200"
          size={1}
        />
        <Controls />
        <MiniMap className="w-32 h-24" />
    </ReactFlow>
}

const FlowProvided = (props: FlowProps) => {
    return <ReactFlowProvider>
        <Flow {...props} />
    </ReactFlowProvider>
}

export { FlowProvided, Flow };