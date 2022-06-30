import WorkflowIcon from '../../icons/components/WorkflowIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import AddButton from '../atoms/AddButton';
import { Select } from '../atoms/Select';
import WorkflowPane from '../containers/WorkflowContainer';

const WorkflowsPane = () => {
  const workflows = useStoreState((state) => state.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const selectWorkflow = useStoreActions((actions) => actions.selectWorkflow);
  const addWorkflow = useStoreActions((actions) => actions.addWorkflow);

  return (
    <div className="flex flex-col flex-nowrap flex-1">
      <div className="flex w-full bg-white h-16">
        <div className="flex-col my-auto pl-4 pr-2 pt-1">
          <Select
            placeholder="No workflows"
            className="w-60"
            value={workflows[selectedWorkflow].id}
            dropdownClassName="w-60 rounded"
            onChange={(e) => selectWorkflow(e)}
            icon={<WorkflowIcon className="ml-2 w-6" />}
          >
            {workflows.map((workflow, num) => (
              <option value={num} key={workflow.id}>
                {workflow.name}
              </option>
            ))}
          </Select>
        </div>
        <AddButton
          className="flex my-auto"
          onClick={() => {
            addWorkflow('new-workflow');
          }}
        ></AddButton>
      </div>

      <WorkflowPane
        workflow={workflows[selectedWorkflow]}
        bgClassName="bg-circle-gray-200"
        className="border border-r-0 h-full border-b-0 border-circle-gray-300"
      />
    </div>
  );
};

export default WorkflowsPane;
