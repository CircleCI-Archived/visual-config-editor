import ReactFlow, {
  Background,
  BackgroundVariant,
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
  const elements = useStoreState(
    (state) => state.workflows[state.selectedWorkflow].elements,
  );
  const transform = useStoreState(
    (state) => state.workflows[state.selectedWorkflow].transform,
  );
  const addWorkflowElement = useStoreActions(
    (actions) => actions.addWorkflowElement,
  );
  const setWorkflowTransform = useStoreActions(
    (actions) => actions.setWorkflowTransform,
  );

  const gap = 15;

  return (
    <div
      className="w-full h-full"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('workflow')) {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        if (e.dataTransfer.types.includes('workflow')) {
          const transfer = JSON.parse(e.dataTransfer.getData('workflow'));
          const pos = {
            x: e.clientX - gap - transform.x,
            y: e.clientY - gap * 3 - transform.y,
          };
          const round = (val: number) =>
            Math.floor(val / transform.zoom / gap) * gap;

          if (transfer) {
            const workflowNode: Node<any> = {
              data: transfer.data,
              connectable: true,
              type: transfer.type,
              id: v4(),
              position: { x: round(pos.x), y: round(pos.y) },
            };

            addWorkflowElement(workflowNode);
          }
        }
      }}
    >
      <ReactFlow
        elements={elements}
        className={props.className}
        onMove={(e) => setWorkflowTransform(e || transform)}
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
