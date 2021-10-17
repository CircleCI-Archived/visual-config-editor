import React from 'react';
import ReactFlow, { Background, BackgroundVariant, Node, NodeTypesType } from 'react-flow-renderer';
import { v4 } from 'uuid';
import { dataMappings } from '../../mappings/ConfigData';
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

  return (
    <div className="w-full h-full" onDragOver={(e) => {
      if (e.dataTransfer.types.includes('workflow')) {
        e.preventDefault();
      }
    }} onDrop={(e) => {

      if (e.dataTransfer.types.includes('workflow')) {
        const transfer = JSON.parse(e.dataTransfer.getData('workflow'));

        console.log(transfer)

        if (transfer) {
          console.log(Math.floor(e.clientX / 10) * 10, Math.floor(e.clientY / 10) * 10)
          const workflowNode: Node<any> = {
            data: transfer.data,
            connectable: true,
            type: transfer.type,
            id: v4(),
            position: { x: Math.floor(e.clientX / 15) * 15, y: Math.floor(e.clientY / 15) * 15 },
          }

          addWorkflowElement(workflowNode);
        }
      }
    }}>
      <ReactFlow elements={elements} className={props.className} selectNodesOnDrag={false} nodeTypes={getTypes()} snapToGrid={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={15} color="#A3A3A3" className={props.bgClassName} size={1}
        />
      </ReactFlow >
    </div>
  );
};

export default WorkflowPane;