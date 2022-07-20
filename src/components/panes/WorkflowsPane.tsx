import { v4 } from 'uuid';
import WorkflowIcon from '../../icons/components/WorkflowIcon';
import { WorkflowStage } from '../../mappings/components/WorkflowMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import AddButton from '../atoms/AddButton';
import { Select } from '../atoms/Select';
import WorkflowPane from '../containers/WorkflowContainer';

const WorkflowsPane = () => {
  const workflows = useStoreState((state) => state.definitions.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const selectWorkflow = useStoreActions((actions) => actions.selectWorkflow);
  const addWorkflow = useStoreActions((actions) => actions.define_workflows);

  return (
    <div className="flex flex-col flex-nowrap flex-1">
      <div className="flex w-full bg-white h-16">
        <div className="flex-col my-auto pl-4 pr-2 pt-1">
          <Select
            placeholder="No workflows"
            className="w-60"
            value={selectedWorkflow}
            dropdownClassName="w-60 rounded"
            onChange={(e) => selectWorkflow(e)}
            icon={<WorkflowIcon className="ml-2 w-6" />}
          >
            {Object.keys(workflows).map((workflow) => (
              <option value={workflow} key={workflow}>
                {workflow}
              </option>
            ))}
          </Select>
        </div>
        <AddButton
          className="flex my-auto"
          onClick={() => {
            addWorkflow(new WorkflowStage('new-workflow', v4(), []));
          }}
        ></AddButton>
      </div>

      <WorkflowPane
        workflow={workflows[selectedWorkflow].value}
        bgClassName="bg-circle-gray-200"
        className="border border-r-0 h-full border-b-0 border-circle-gray-300"
      />
    </div>
  );
};

export default WorkflowsPane;
