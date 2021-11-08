import { useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  FlowTransform,
  Node,
  NodeTypesType,
} from 'react-flow-renderer';
import { v4 } from 'uuid';
import { dataMappings } from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { WorkflowModel } from '../../state/Store';

export interface ElementProps {
  className?: string;
  bgClassName?: string;
  workflow: WorkflowModel;
}

const getTypes = (): NodeTypesType =>
  Object.assign(
    {},
    ...dataMappings.map((component) => {
      const node = component.mapping.node;

      if (node) {
        return { [node.type]: node.component };
      }

      return null;
    }),
  );

const WorkflowPane = (props: ElementProps) => {
  const [transform, setTransform] = useState<FlowTransform>({ x: 0, y: 0, zoom: 1 });
  const elements = useStoreState(
    (state) => state.workflows[state.selectedWorkflow].elements,
  );
  const addWorkflowElement = useStoreActions(
    (actions) => actions.addWorkflowElement,
  );

  const dragging = useStoreState((state) => state.dragging);

  const gap = 15;

  return (
    <div
      className="w-full h-full"
      onDragOver={(e) => {
        if (dragging?.dataType?.dragTarget === 'workflow') {
          e.preventDefault();
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
            data,
            connectable: true,
            type: dragging.dataType.type,
            id: v4(),
            position: { x: round(pos.x), y: round(pos.y) },
          };

          addWorkflowElement(workflowNode);
        }
      }}
    >
      <ReactFlow
        elements={elements}
        className={props.className}
        onMove={(e) => setTransform(e || transform)}
        selectNodesOnDrag={false}
        nodeTypes={getTypes()}
        snapToGrid={true}
      >
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
