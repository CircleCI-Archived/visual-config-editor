import { Job } from '@circleci/circleci-config-sdk';
import React, { useState } from 'react';
import ReactFlow, { Background, BackgroundVariant, Elements, Node } from 'react-flow-renderer';
import { v4 } from 'uuid';
import dataTypes from '../../data/ConfigData';
import JobData from '../../data/JobData';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import Store, { WorkflowModel } from '../../state/Store';
import JobNode, { JobNodeProps } from '../containers/nodes/JobNode';

interface ElementProps {
  className?: string;
  bgClassName?: string;
  workflow: WorkflowModel
}

const WorkflowPane = (props: ElementProps) => {
  // const elements = useStoreState((state) => JobData.node?.store.get(state))
  const jobNodes = useStoreState((state) => state.workflows[0].jobNodes);
  const addWorkflowJob = useStoreActions((actions) => actions.addWorkflowJob);

  console.log(jobNodes)

  return (
    <div className="w-full h-full" onDragOver={(e) => {
      if (e.dataTransfer.types.includes('workflow')) {
        e.preventDefault();
      }
    }} onDrop={(e) => {
      const data = JSON.parse(e.dataTransfer.getData('workflow'));

      if (data) {
        const workflowJob: Node<JobNodeProps> = {
          data: {
            parameters: {
            },
            job: data
          },
          type: 'job',
          id: v4(),
          position: { x: e.clientX, y: e.clientY },
        }

        addWorkflowJob(workflowJob);
      }
    }}>
      <ReactFlow elements={jobNodes} className={props.className} selectNodesOnDrag={false} nodeTypes={{ job: JobNode }}
      >
        <Background variant={BackgroundVariant.Lines} gap={150} color="#000000" className={props.bgClassName} size={1}
        />
      </ReactFlow >
    </div>
  );
};

export default WorkflowPane;