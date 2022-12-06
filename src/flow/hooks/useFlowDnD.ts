import { useCallback, useState } from "react";
import { applyNodeChanges, useReactFlow, XYPosition } from "reactflow";
import { v4 } from "uuid";
import { useStoreActions, useStoreState } from "../../core/state/Hooks";
import InspectableMapping from "../../mappings/InspectableMapping";
import { NodeMapping } from "../../mappings/NodeMapping";
import { FlowActionsModel, FlowStoreModel } from "../state/FlowStore";
import { useFlowOffset } from "./useFlowOffset";

// Alternative to control a node during drag and drop cycle
// If abstracted a layer higher, useDragAndDrop may come in handy later
export function useFlowDragAndDrop(offset?: DOMRect) {
  const { addNodes, getNodes } = useReactFlow();
  const dragging = useStoreState((state) => state.dragging);
  const cancel = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault() }, []);
  const onDrop = useFlowOffset((position, droppedItem) => {
    const mapping = dragging?.dataMapping as unknown as NodeMapping & InspectableMapping;

    if (dragging == undefined || !mapping?.node) {
      return;
    }

    const nodes = getNodes();
    const data = mapping.node.transform(dragging.data, nodes);
    const id = mapping.node.getId(data)

    addNodes({  id, position, type: mapping.node.key, data});
  }, offset, [dragging]);

  return { onDragEnter: cancel, onDragOver: cancel, onDrop }
}

// Alternative to control a node during drag and drop cycle
// export function useFlowDragAndDrop(offset?: DOMRect) {
//   const { addNodes, setNodes, deleteElements, getNodes } = useReactFlow();
//   const [lastPos, setPos] = useState<XYPosition>();

//   // Upon entering the flow, create the drop ghost
//   const onDragEnter = useFlowOffset((position, data) => {
//     addNodes({  id: 'ghost', position, type: 'ghost',data: ''});
//     }, offset);

//   // While dragging, move the ghost
//   const onDragOver = useFlowOffset((position, data) => {
//     if (lastPos) {
//       const dx = lastPos.x - position.x;
//       const dy = lastPos.y - position.y;
//       const dist = Math.abs(dx * dy);

//       if (dist > 150) {
//         console.log(dist)
//           const nodes = getNodes();
//           const changes = applyNodeChanges([ {  id: 'ghost', type: 'position', position, dragging: true } ], nodes);
//           setNodes(changes);
//           setPos(position);
//       }
//     } else {
//       setPos(position);
//     }
//   }, offset, [lastPos]);
//   // Upon drop and leave, remove the ghost`
//   const onDragLeave = useFlowOffset((pos, data) => {
//     deleteElements({ nodes: [{ id: 'ghost' }]})
//   }, offset);
//   const onDrop = useFlowOffset((position, data) => {
//     addNodes({  id: 'ghost', position, type: 'job', data});
//   }, offset);


//   return [onDragEnter, onDragOver, onDragLeave, onDrop]
// }
