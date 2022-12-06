import { useCallback, useRef } from "react";
import ReactFlow, { addEdge, Background, Connection, Controls, Edge, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, useStoreApi, useViewport } from "reactflow";
import { useStoreState } from "../../core/state/Hooks";
import { useFlowDragAndDrop } from "../hooks/useFlowDnD";
import { FlowMode } from "../state/FlowStore";
import ConnectionLine from "./ConnectionLine";
import GhostNode from "./GhostNode";
import JobNode from "./JobNode";

export type FlowProps = { className?: string }

const nodeTypes = {
  workflow_job: JobNode,
  ghost: GhostNode,
};

const Flow = (props: FlowProps) => {
    const flowRef = useRef<HTMLDivElement>(null);
    const nodeState = useNodesState([]);
    const [nodes, , onNodesChange] = nodeState;
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const mode = useStoreState((state) => state.mode);
    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const flowRect = flowRef.current?.getBoundingClientRect();
    const {onDragEnter, onDragOver, onDrop} = useFlowDragAndDrop(flowRect);

    return <ReactFlow
        minZoom={-Infinity}
        fitView
        nodes={nodes}
        edges={edges}
        ref={flowRef}
        // onPaneMouseMove={(e) => { console.log(e.clientX, e.clientY)}}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesDraggable={mode == FlowMode.MOVE}
        elementsSelectable={mode == FlowMode.SELECT}
        connectionLineComponent={ConnectionLine}
        snapToGrid
        nodeTypes={nodeTypes}
        className={props.className}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
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
      // const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

    // const onNodesChange = useCallback(
    //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    //   [setNodes]
    // );
    // const onEdgesChange = useCallback(
    //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //   [setEdges]
    // );
    // const onConnect = useCallback(
    //   (connection) => setEdges((eds) => addEdge(connection, eds)),
    //   [setEdges]
    // );

    // const getClosestNode = useCallback((pos: XYPosition) => {
    //     const { nodeInternals } = store.getState();
    //     const storeNodes = Array.from(nodeInternals.values());

    //     const closestNode = storeNodes.reduce<{ distance: number, node?: Node<any>}>(
    //       (res, n) => {
    //         const boundingRect = flowRef.current?.getBoundingClientRect() || { x: 0, y: 0};
    //         const mouseX = Math.abs((pos.x - boundingRect.x) * viewport.zoom + viewport.x);
    //         const mouseY = Math.abs((pos.y - boundingRect.y) * viewport.zoom + viewport.y)
    //         const dx = Math.abs(n.position.x) - mouseX;
    //         const dy = Math.abs(n.position.y) - mouseY;
    //         const d = Math.sqrt(dx * dx + dy * dy);

    //         // console.log(pos.y - boundingRect.y, mouseY, viewport.y)

    //         if (d < res.distance && d < MIN_DISTANCE) {
    //             res.distance = d;
    //             res.node = n;
    //         }

    //         return res;
    //       },
    //       {
    //         distance: Number.MAX_VALUE,
    //         node: undefined,
    //       }
    //     );

    //     if (!closestNode.node) {
    //       return null;
    //     }

    // // console.log(closestNode.node)

    //     return closestNode.node;
    //   }, [viewport]);
