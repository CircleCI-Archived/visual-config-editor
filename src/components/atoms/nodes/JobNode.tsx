import { Job } from '@circleci/circleci-config-sdk';
import { WorkflowJobParameters } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/types/WorkflowJob.types';
import React, { useRef } from 'react';
import {
  Handle,
  isNode,
  NodeProps,
  Position
} from 'react-flow-renderer';
import JobIcon from '../../../icons/components/JobIcon';
import DragItemIcon from '../../../icons/ui/DragItemIcon';
import PlusIcon from '../../../icons/ui/PlusIcon';
import { WorkflowJob } from '../../../mappings/JobMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';

const JobNode: React.FunctionComponent<NodeProps & { data: WorkflowJob }> = (
  props,
) => {
  const elements = useStoreState(
    (state) => state.workflows[state.selectedWorkflow].elements,
  );
  const dragging = useStoreState((state) => state.dragging);
  // const setWorkflowElements = useStoreActions(
  //   (actions) => actions.setWorkflowElements,
  // );
  const updateJob = useStoreActions((actions) => actions.updateJob);
  const setConnecting = useStoreActions((actions) => actions.setConnecting);
  const connecting = useStoreState((state) => state.connecting);
  const updateConnecting = useStoreActions(
    (actions) => actions.updateConnecting,
  );

  const updateWorkflowJob = (
    workflowJob: WorkflowJob,
    applyToData: { job?: Job; parameters?: WorkflowJobParameters },
  ) =>
    elements.map((element) =>
      isNode(element) && element.data.job.name === workflowJob.job.name
        ? { ...element, data: { ...workflowJob, ...applyToData } }
        : element,
    );
  const [hovering, setHovering] = React.useState({
    handles: false,
    node: false,
    requiredBy: false,
    dragHandle: false,
    requires: false,
  });

  const trackHovering = (
    entering: string[],
    leaving: string[],
    postEnter?: () => void,
    postLeave?: () => void,
  ) => {
    return {
      onMouseEnter: () => {
        setHovering(
          entering.reduce(
            (previous, n) => ({ ...previous, [n]: true }),
            hovering,
          ),
        );
        postEnter && postEnter();
      },
      onMouseLeave: () => {
        setHovering(
          leaving.reduce(
            (previous, n) => ({ ...previous, [n]: false }),
            hovering,
          ),
        );
        postLeave && postLeave();
      },
    };
  };

  const nodeRef = useRef(null);

  // const onConnect = (params: Connection) => {
  //   const targetJob = elements.find(
  //     (element) => element.id === params.target,
  //   )?.data;

  //   setWorkflowElements(
  //     addEdge(
  //       {
  //         ...params,
  //         animated: false,
  //         style: { stroke: '#A3A3A3', strokeWidth: '2px' },
  //       },
  //       updateWorkflowJob(targetJob, {
  //         parameters: {
  //           requires: [props.data.job.name],
  //         },
  //       }),
  //     ),
  //   );
  // };

  return (
    <div
      className={`p-8 flex flex-row cursor-default`}
      {...trackHovering(
        ['handles'],
        ['handles', 'node', 'requires', 'requiredBy'],
        () => {
          updateConnecting({
            ref: nodeRef,
            id: {
              connectionNodeId: props.id,
              connectionHandleType: 'target',
              connectionHandleId: `${props.id}_target`,
            },
          });
        },
        () => {
          updateConnecting(undefined);
        },
      )}
      onDragOver={(e) => {
        if (dragging && dragging.dataType?.dragTarget === 'job') {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        if (
          dragging &&
          dragging.dataType?.dragTarget === 'job' &&
          dragging.dataType.applyToNode
        ) {
          const applyToData = dragging.dataType.applyToNode(
            dragging.data,
            props.data,
          );

          if ('job' in applyToData) {
            updateJob({ old: props.data.job, new: applyToData.job });
          }

          if ('parameters' in applyToData) {
            updateWorkflowJob(props.data, applyToData);
          }
        }
      }}
    >
      <button
        className={`opacity-${
          hovering['handles'] && !hovering['node'] && !connecting?.start
            ? 100
            : 0
        } transition-opacity duration-300  w-4 h-4 my-auto mr-5`}
        id={`${props.id}_source`}
        {...trackHovering(['requires', 'handles'], ['requires'])}
      >
        <PlusIcon
          filled={hovering['requires']}
          color="rgb(0, 120, 202)"
          className="bg-white rounded-full w-full border border-white"
        />
      </button>

      <button
        className={`p-2 bg-white flex flex-row text-black rounded-md border cursor-pointer 
        ${
          (hovering['node'] && !hovering['dragHandle']) ||
          (hovering['handles'] && connecting?.start)
            ? 'border-circle-blue'
            : 'border-circle-gray-300'
        }`}
        ref={nodeRef}
        {...trackHovering(['node'], ['node'])}
      >
        <div className="flex w-full">
          <JobIcon className="w-5 mr-2" />
          {props.data.parameters?.name || props.data.job.name}
        </div>
        <div
          className={`dragHandle cursor-grab my-auto
          opacity-${hovering['node'] ? 100 : 0} 
          transition-opacity duration-150 w-8 h-full flex`}
          {...trackHovering(['dragHandle'], ['dragHandle'])}
        >
          <DragItemIcon className="w-4 m-auto" color="#AAAAAA" />
        </div>
      </button>

      <button
        className={`opacity-${
          hovering['handles'] && !hovering['node'] && !connecting?.start
            ? 100
            : 0
        } source transition-opacity duration-300 w-4 h-4 my-auto ml-5`}
        {...trackHovering(['requiredBy', 'handles'], ['requiredBy'])}
        id={`${props.id}_target`}
        // onClick={() => {
        //   const workflowNode: Node<any> = {
        //     id: v4(),
        //     connectable: true,
        //     type: 'ghost',
        //     position: { x: 0, y: 0 },
        //   };

        //   setPlaceholder(workflowNode);
        // }}
        draggable
        onDragStart={(e) => {
          setConnecting({
            ref: nodeRef,
            id: {
              connectionNodeId: props.id,
              connectionHandleType: 'source',
              connectionHandleId: `${props.id}_source`,
            },
          });
          e.preventDefault();
        }}
      >
        <PlusIcon
          className="bg-white rounded-full w-full border border-white"
          color="rgb(0, 120, 202)"
          filled={hovering['requiredBy']}
        />
      </button>

      <Handle
        type="source"
        className="opacity-0"
        position={Position.Right}
        id={`${props.id}_source`}
      ></Handle>
      <Handle
        className="opacity-0"
        id={`${props.id}_target`}
        type="target"
        position={Position.Left}
      />
    </div>
  );
};

export default JobNode;
