import { Job } from '@circleci/circleci-config-sdk';
import React, { useState } from 'react';
import ReactFlow, { Background, BackgroundVariant, Elements, Node, NodeTypesType } from 'react-flow-renderer';
import { v4 } from 'uuid';
import dataTypes, { componentToType, dataMappings } from '../../data/ConfigData';
import JobData from '../../data/JobData';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import Store, { WorkflowModel } from '../../state/Store';
import JobNode, { JobNodeProps } from '../containers/nodes/JobNode';

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
  const elements = useStoreState((state) => state.workflows[0].elements);
  const addWorkflowElement = useStoreActions((actions) => actions.addWorkflowElement);

  return (
    <div className="w-full h-full" onDragOver={(e) => {
      if (e.dataTransfer.types.includes('workflow')) {
        e.preventDefault();
      }
    }} onDrop={(e) => {
      const transfer = JSON.parse(e.dataTransfer.getData('workflow'));

      console.log(transfer);

      if (transfer) {
        const workflowNode: Node<any> = {
          data: transfer.data,
          connectable: true,
          type: transfer.type,
          id: v4(),
          position: { x: e.clientX, y: e.clientY },
        }

        addWorkflowElement(workflowNode);
      }
    }}>
      <ReactFlow elements={elements} className={props.className} selectNodesOnDrag={false} nodeTypes={getTypes()}
      >
        <Background variant={BackgroundVariant.Lines} gap={150} color="#000000" className={props.bgClassName} size={1}
        />
      </ReactFlow >
    </div>
  );
};

export default WorkflowPane;