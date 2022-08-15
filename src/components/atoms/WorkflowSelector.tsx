import { v4 } from 'uuid';
import WorkflowIcon from '../../icons/components/WorkflowIcon';
import ExpandIcon from '../../icons/ui/ExpandIcon';
import { WorkflowStage } from '../../mappings/components/WorkflowMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import DropdownContainer from '../containers/DropdownContainer';

export const WorkflowSelector = () => {
  const workflows = useStoreState((state) => state.definitions.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflowId);

  const selectWorkflow = useStoreActions((actions) => actions.selectWorkflow);
  const addWorkflow = useStoreActions((actions) => actions.define_workflows);

  return (
    <DropdownContainer alignLeft className="rounded-md mx-3 my-auto px-2 border border-circle-gray-300 hover:bg-circle-gray-250">
      <ExpandIcon className="w-3 h-6" expanded={true} />
      <div className="rounded border border-circle-gray-300 p-2 z-30 bg-white flex flex-col">
        {Object.keys(workflows).map((workflow) => (
          <button
            value={workflow}
            key={workflow}
            className={`rounded flex w-full hover:bg-circle-gray-250 border-b border-circle-gray-300 p-2`}
            type="button"
            onClick={(e) =>
              workflow !== selectedWorkflow && selectWorkflow(workflow)
            }
          >
            {workflow === selectedWorkflow && (
              <WorkflowIcon className="w-6 p-1 mr-1" />
            )}
            {workflow}
          </button>
        ))}
        <button
          className="tracking-wide hover:bg-circle-gray-200 leading-6 p-2 text-sm text-circle-blue font-medium"
          onClick={() =>
            addWorkflow(new WorkflowStage('new-workflow', v4(), []))
          }
        >
          Add New Workflow
        </button>
      </div>
    </DropdownContainer>
  );
};
