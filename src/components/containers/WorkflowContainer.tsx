import { orb } from '@circleci/circleci-config-sdk';
import { WorkflowJobParameters } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/types/WorkflowJob.types';
import { useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  ConnectionLineComponentProps,
  ConnectionMode,
  EdgeProps,
  FlowTransform,
  isNode,
  Node,
  NodeTypesType,
  useStoreActions as flowActions,
} from 'react-flow-renderer';
import { v4 } from 'uuid';
import { dataMappings } from '../../mappings/GenerableMapping';
import { JobMapping } from '../../mappings/components/JobMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import ConnectionLine from '../atoms/ConnectionLine';
import Edge from '../atoms/Edge';

export interface ElementProps {
  className?: string;
  bgClassName?: string;
}

const getTypes = (): NodeTypesType =>
  Object.assign(
    {},
    ...dataMappings.map((component) =>
      component.mapping.node
        ? { [component.mapping.key]: component.mapping.node.component }
        : null,
    ),
  );

const WorkflowContainer = ({ bgClassName, className }: ElementProps) => {
  const importOrb = useStoreActions((actions) => actions.importOrb);
  const [transform, setTransform] = useState<FlowTransform>({
    x: 0,
    y: 0,
    zoom: 1,
  });
  const [cooldown, setCooldown] = useState(false);
  const elements = useStoreState(
    (state) =>
      state.definitions.workflows[state.selectedWorkflowId].value.elements,
  );
  const addWorkflowElement = useStoreActions(
    (actions) => actions.addWorkflowElement,
  );
  const setWorkflowElements = useStoreActions(
    (actions) => actions.setWorkflowElements,
  );
  const dragging = useStoreState((state) => state.dragging);
  const connecting = useStoreState((state) => state.connecting);
  const setConnecting = useStoreActions((actions) => actions.setConnecting);
  const altAction = useStoreState((state) => state.altAction);
  const setAltAction = useStoreActions((actions) => actions.setAltAction);
  const [connectingTo, setConnectingTo] = useState({ x: 0, y: 0 });

  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && !cooldown) {
      setAltAction(!altAction);

      setCooldown(true);

      setTimeout(() => {
        setCooldown(false);
      }, 5);
    }
  });

  const updateWorkflowJob = (
    targetJob: string,
    applyToData: (parameters: WorkflowJobParameters) => WorkflowJobParameters,
  ) =>
    elements.map((element) => {
      return isNode(element) &&
        JobMapping.node?.transform &&
        (element.data.parameters?.name || element.data.job.name) === targetJob
        ? {
            ...element,
            data: JobMapping.node.transform(
              element.data.job,
              applyToData(element.data.parameters),
            ),
          }
        : element;
    });

  const handleMouseUp = () => {
    if (connecting?.start?.name) {
      const source =
        connecting.start.id.connectionHandleType === 'source'
          ? connecting.start
          : connecting.end;
      const target =
        connecting.start.id.connectionHandleType === 'source'
          ? connecting.end
          : connecting.start;
      const startName = source?.name;

      if (target?.name && startName) {
        if (
          connecting.intent === 'creating' &&
          source.id.connectionNodeId !== target.id.connectionNodeId
        ) {
          setWorkflowElements(
            addEdge(
              {
                source: source.id.connectionNodeId,
                target: target.id.connectionNodeId,
                type: 'requires',
                sourceHandle: source.id.connectionHandleId,
                targetHandle: target.id.connectionNodeId,
                animated: false,
                style: { stroke: '#A3A3A3', strokeWidth: '2px' },
              },
              updateWorkflowJob(target.name, (parameters) => ({
                ...parameters,
                requires: parameters?.requires
                  ? [...parameters.requires, startName]
                  : [startName],
              })),
            ),
          );
        } else {
          const updated = updateWorkflowJob(target.name, (parameters) => {
            let requires = undefined;

            if (parameters.requires) {
              const updatedRequires = parameters?.requires?.filter(
                (requirement) => requirement !== startName,
              );
              requires =
                updatedRequires.length > 0 ? updatedRequires : undefined;
            }
            return {
              ...parameters,
              requires,
            };
          });

          const filtered = updated.filter((e) => {
            if (e.type !== 'requires') {
              return true;
            }

            const edge = e as EdgeProps;

            return (
              edge.source !== source.id.connectionNodeId ||
              edge.target !== target.id.connectionNodeId
            );
          });

          setWorkflowElements(filtered);
        }
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

  const NodeGraph = () => {
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
            data = nodeMapping.transform(data, undefined, elements);
          }

          if (data.job instanceof orb.OrbRef) {
            importOrb(data.job.orb);
          }

          const workflowNode: Node<any> = {
            id: v4(),
            data,
            connectable: true,
            dragHandle: '.node',
            type: dragging.dataType.key,
            position: { x: round(pos.x), y: round(pos.y) },
          };

          addWorkflowElement(workflowNode);
        }
      }}
    >
      <ReactFlow
        elements={elements}
        className={className}
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
        <NodeGraph />
        <Background
          variant={BackgroundVariant.Dots}
          gap={gap}
          color="#A3A3A3"
          className={bgClassName}
          size={1}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowContainer;
