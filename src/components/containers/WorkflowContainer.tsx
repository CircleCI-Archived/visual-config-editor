import { useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  ConnectionLineComponentProps,
  ConnectionMode,
  FlowTransform,
  Node,
  NodeTypesType,
} from 'react-flow-renderer';
import { v4 } from 'uuid';
import { dataMappings } from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import {
  useStoreState as flowState,
  useStoreActions as flowActions,
} from 'react-flow-renderer';
import { WorkflowModel } from '../../state/Store';
import GhostNode from '../atoms/nodes/GhostNode';
import ConnectionLine from '../atoms/ConnectionLine';
import Edge from '../atoms/Edge';

export interface ElementProps {
  className?: string;
  bgClassName?: string;
  workflow: WorkflowModel;
}

const getTypes = (): NodeTypesType =>
  Object.assign(
    {
      ghost: GhostNode,
    },
    ...dataMappings.map((component) => {
      const node = component.mapping.node;

      if (node) {
        return component.mapping.node && { [node.type]: node.component };
      }

      return null;
    }),
  );

const WorkflowPane = (props: ElementProps) => {
  const [transform, setTransform] = useState<FlowTransform>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const elements = useStoreState(
    (state) => state.workflows[state.selectedWorkflow].elements,
  );
  const addWorkflowElement = useStoreActions(
    (actions) => actions.addWorkflowElement,
  );

  const dragging = useStoreState((state) => state.dragging);
  const connecting = useStoreState((state) => state.connecting);
  const setWorkflowElements = useStoreActions(
    (actions) => actions.setWorkflowElements,
  );
  const setConnecting = useStoreActions((actions) => actions.setConnecting);
  const [connectingTo, setConnectingTo] = useState({ x: 0, y: 0 });

  // const updateWorkflowJob = (
  //   workflowJob: WorkflowJob,
  //   applyToData: { job?: Job; parameters?: WorkflowJobParameters },
  // ) =>
  //   elements.map((element) =>
  //     isNode(element) && element.data.job.name === workflowJob.job.name
  //       ? { ...element, data: { ...workflowJob, ...applyToData } }
  //       : element,
  //   );

  const handleMouseUp = () => {
    if (connecting?.start) {
      if (connecting?.end) {
        console.log('conneting');
        setWorkflowElements(
          addEdge(
            {
              source: connecting.start.id.connectionNodeId,
              target: connecting.end.id.connectionNodeId,
              type: 'requires',
              sourceHandle: connecting.start.id.connectionHandleId,
              targetHandle: connecting.end.id.connectionNodeId,
              animated: false,
              style: { stroke: '#A3A3A3', strokeWidth: '2px' },
            },
            elements,
            // updateWorkflowJob(targetJob, {
            //   parameters: {
            //     requires: [props.data.job.name],
            //   },
            // }),
          ),
        );
      }

      setConnecting({
        id: {
          connectionNodeId: null,
          connectionHandleType: null,
          connectionHandleId: null,
        },
      });
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const gap = 15;

  const NodesDebugger = () => {
    // const asdsa = flowState((state) => state.connectionPosition);
    const setConnecting = flowActions((state) => state.setConnectionNodeId);
    const setConnectingPosition = flowActions(
      (state) => state.setConnectionPosition,
    );

    useEffect(() => {
      setConnecting(connecting?.start?.id);
      setConnectingPosition({
        x: connectingTo.x - transform.x,
        y: connectingTo.y - transform.y,
      });
    });

    return null;
  };

  return (
    <div
      className="w-full h-full"
      onDragOver={(e) => {
        if (dragging?.dataType?.dragTarget === 'workflow') {
          e.preventDefault();
        }
      }}
      onDrag={(e) => {}}
      onMouseMove={(e) => {
        const containerBounds = (e.target as Element)
          .closest('.react-flow')
          ?.getBoundingClientRect();

        if (containerBounds) {
          setConnectingTo({
            x: e.clientX + transform.x - containerBounds.left,
            y: e.clientY + transform.y - containerBounds.top,
          });
        }
      }}
      onDrop={(e) => {
        const nodeMapping = dragging?.dataType?.node;

        if (dragging?.dataType?.dragTarget === 'workflow' && nodeMapping) {
          const pos = {
            x: e.clientX - gap - transform.x,
            y: e.clientY - gap * 3 - transform.y,
          };
          const round = (val: number) =>
            Math.floor(val / transform.zoom / gap) * gap;
          let data = dragging.data;

          if (nodeMapping.transform) {
            data = nodeMapping.transform(data);
          }

          const workflowNode: Node<any> = {
            id: v4(),
            data,
            dragHandle: '.dragHandle',
            connectable: true,
            type: dragging.dataType.type,
            position: { x: round(pos.x), y: round(pos.y) },
          };

          addWorkflowElement(workflowNode);
        }
      }}
    >
      <ReactFlow
        elements={elements}
        className={props.className}
        onMove={(e) => {
          setTransform(e || transform);
        }}
        selectNodesOnDrag={false}
        nodeTypes={getTypes()}
        edgeTypes={{ requires: Edge }}
        snapToGrid={true}
        connectionMode={ConnectionMode.Loose}
        connectionLineComponent={
          ConnectionLine as React.ComponentType<ConnectionLineComponentProps>
        }
      >
        <NodesDebugger />
        <Background
          variant={BackgroundVariant.Dots}
          gap={gap}
          color="#A3A3A3"
          className={props.bgClassName}
          size={1}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowPane;
