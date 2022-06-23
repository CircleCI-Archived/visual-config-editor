import React from 'react';
import { EdgeProps, isNode } from 'react-flow-renderer';
import DeleteItemIcon from '../../icons/ui/DeleteItemIcon';
import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
} from 'react-flow-renderer';
import { useStoreActions, useStoreState } from '../../state/Hooks';

import ReactFlow, {
  removeElements,
  addEdge,
  Background,
} from 'react-flow-renderer';
import { WorkflowModel } from '../../state/Store';
import ElementProps from '../containers/WorkflowContainer';
import { WorkflowJobParameters } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/types/WorkflowJob.types';
import { workflow, Job, types } from '@circleci/circleci-config-sdk';

const foreignObjectSize = 40;

export default function Edge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}: EdgeProps) {
  const gap = 45;

  //   const [elements, setElements] = useState(initialElements);

  // // const [edgeCenterX, edgeCenterY] = getEdgeCenter({
  // //   sourceX,
  // //   sourceY,
  // //   targetX,
  // //   targetY,
  // // });
  // const elements = useStoreState(
  //   (state) => state.workflows[state.selectedWorkflow].elements,
  // );

  const elements = useStoreState(
    (state) => state.workflows[state.selectedWorkflow].elements,
  );

  interface ElementProps {
    className?: string;
    bgClassName?: string;
    workflow: WorkflowModel;
  }

  const updateWorkflowJob = (
    workflowJob: workflow.WorkflowJob,
    applyToData: {
      job?: Job;
      parameters?: types.workflow.WorkflowJobParameters;
    },
  ) =>
    elements.map((element) =>
      isNode(element) && element.data.job.name === workflowJob.job.name
        ? { ...element, data: { ...workflowJob, ...applyToData } }
        : element,
    );
  const edgeCenterX = sourceX + (targetX - sourceX + gap / 2) / 2;
  const edgeCenterY = sourceY + (targetY - sourceY) / 2;

  // const deleteNode = (id) => {
  //   setElements((els) => removeElements([elements[id]], els));
  // };

  return (
    <g>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={`M${sourceX - gap * 2},${sourceY} ${sourceX - gap},${sourceY} ${
          sourceX - gap
        },${sourceY} ${targetX + gap},${targetY} ${targetX + gap},${targetY} ${
          targetX + gap * 2
        },${targetY}`}
      />
      {/* <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px' }}
          startOffset="50%"
          textAnchor="middle"
        >
          {'delete'}
        </textPath>
                      </text>  */}

      <foreignObject
        width={foreignObjectSize + 10}
        height={foreignObjectSize + 10}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <body>
          <button
            className="edgebutton"
            onClick={(event) => {
              console.log(id.length);
            }}
          >
            ×
          </button>
        </body>
      </foreignObject>
    </g>
  );
}
