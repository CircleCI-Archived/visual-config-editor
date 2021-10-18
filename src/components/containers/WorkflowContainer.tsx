import React from 'react';
import ReactFlow, { Background, BackgroundVariant, FlowTransform, Node, NodeTypesType, useStore } from 'react-flow-renderer';
import { v4 } from 'uuid';
import { dataMappings } from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { WorkflowModel } from '../../state/Store';

export interface ElementProps {
  className?: string;
  bgClassName?: string;
  workflow: WorkflowModel
}


const getTypes = (): NodeTypesType => Object.assign({}, ...dataMappings.map((component) => {
  const node = component.dataType.node;

  if (node) {
    return { [node.type]: node.component }
  }
}))

const WorkflowPane = (props: ElementProps) => {
  const elements = useStoreState((state) => state.workflows[state.selectedWorkflow].elements);
  const addWorkflowElement = useStoreActions((actions) => actions.addWorkflowElement);
  let curTransform: FlowTransform = { x: 0, y: 0, zoom: 1 }

  const updateLocation = (transform?: FlowTransform) => {
    if (transform) {
      curTransform = transform;
    }
  }

  const gap = 15;

  return (
    <div className="w-full h-full" onDragOver={(e) => {
      if (e.dataTransfer.types.includes('workflow')) {
        e.preventDefault();
      }
    }} onDrop={(e) => {

      if (e.dataTransfer.types.includes('workflow')) {
        const transfer = JSON.parse(e.dataTransfer.getData('workflow'));
        const pos = { x: e.clientX - gap - curTransform.x, y: e.clientY - gap * 3 - curTransform.y}
        const round = (val: number) => (Math.floor(val / gap) * gap) / curTransform.zoom;

        if (transfer) {
          const workflowNode: Node<any> = {
            data: transfer.data,
            connectable: true,
            type: transfer.type,
            id: v4(),
            position: { x: round(pos.x), y: round(pos.y) },
          }

          addWorkflowElement(workflowNode);
        }
      }
    }}>
      <ReactFlow elements={elements} className={props.className} onMove={updateLocation} selectNodesOnDrag={false} nodeTypes={getTypes()} snapToGrid={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={gap} color="#A3A3A3" className={props.bgClassName} size={1}
        />
      </ReactFlow >
    </div>
  );
};

export default WorkflowPane;