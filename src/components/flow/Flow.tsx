import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, useOnViewportChange, BackgroundVariant, ControlButton, Controls, MiniMap, Node, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, useStoreApi, useViewport, Viewport, XYPosition, applyNodeChanges, applyEdgeChanges, addEdge, Edge, Connection, ConnectionMode } from "reactflow";
import { FlowMode } from "../../state/FlowStore";
import { useStoreState } from "../../state/Hooks";
import { DataModel } from "../../state/Store";
import ConnectionLine from "./ConnectionLine";
import GhostNode from "./GhostNode";
import JobNode from "./JobNode";

export type FlowProps = { className?: string }


const nodeTypes = {
  job: JobNode,
  ghost: GhostNode,
};

const initialNodes = [
    {
      id: '1',
      type: 'job',
      data: { label: 'Node A' },
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      type: 'job',
      data: { label: 'Node B' },
      position: { x: 100, y: 200 },
    },
    {
      id: '3',
      type: 'job',
      data: { label: 'Node C' },
      position: { x: 350, y: 200 },
    },
  ];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', label: 'updatable edge' }];
const MIN_DISTANCE = 1000;

type FlowDropEvent = (position: XYPosition, dragging?: DataModel) => void;

function useFlowOffset(func: FlowDropEvent, offset?: DOMRect, deps?: any[]) {
  const { project } = useReactFlow();
  const dragging = useStoreState((state) => state.dragging);

  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
// console.log(dragging?.dataType?.dragTarget);

//     if (dragging?.dataType?.dragTarget !== 'workflow') {
//       return;
//     }

    const eventPos = project({ x: e.clientX, y: e.clientY - (offset?.y || 0)});

    func(eventPos, dragging);

    e.preventDefault();
  }, deps ? [project, ...deps] : [project]);
}

function useFlowDragAndDrop(offset?: DOMRect) {
  const { addNodes, setNodes, deleteElements, getNodes,  } = useReactFlow();
  const [lastPos, setPos] = useState<XYPosition>();

  const onDragEnter = useFlowOffset((position, data) => {
    console.log(position)
    addNodes({  id: 'ghost', position, type: 'ghost',data: ''});
   }, offset); // Upon entering the flow, create the drop ghost
  const onDragOver = useFlowOffset((position, data) => {
    if (lastPos) {
      const dx = lastPos.x - position.x;
      const dy = lastPos.y - position.y;
      const dist = Math.abs(dx * dy);

      if (dist > 150) {
        console.log(dist)
          const nodes = getNodes();
          const changes = applyNodeChanges([ {  id: 'ghost', type: 'position', position, dragging: true } ], nodes);
          setNodes(changes);
          setPos(position);
      }
    } else {
      setPos(position);
    }
  }, offset, [lastPos]); // While dragging, move the ghost
  const onDragLeave = useFlowOffset((pos, data) => {
    deleteElements({ nodes: [{ id: 'ghost' }]})
    console.log('leave', pos)
  }, offset); // Upon drop and leave, remove the ghost
  const onDrop = useFlowOffset((pos, data) => {
    deleteElements({ nodes: [{ id: 'ghost' }]})
    console.log('end', pos)
  }, offset); // Upon drop and leave, remove the ghost


  return [onDragEnter, onDragOver, onDragLeave, onDrop]
}

const Flow = (props: FlowProps) => {
    const store = useStoreApi();
    const viewport = useViewport();
    const { project, viewportInitialized } = useReactFlow();
    const flowRef = useRef<HTMLDivElement>(null);
    const nodeState = useNodesState(initialNodes);
    const [nodes, setNodes, onNodesChange] = nodeState;
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const mode = useStoreState((state) => state.mode);
    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const flowRect = flowRef.current?.getBoundingClientRect();
    const [onDragEnter, onDragOver, onDragLeave, onDrop] = useFlowDragAndDrop(flowRect);


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
        connectionLineStyle={ { zIndex: -10 }}
        snapToGrid
        nodeTypes={nodeTypes}
        className={props.className}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeaveCapture={onDragLeave}
        onDrop={onDrop}
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
