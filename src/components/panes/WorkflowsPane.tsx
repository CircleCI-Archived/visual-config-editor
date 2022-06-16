import WorkflowIcon from '../../icons/components/WorkflowIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import Select from '../atoms/Select';
import WorkflowPane from '../containers/WorkflowContainer';

const WorkflowsPane = () => {
  const workflows = useStoreState((state) => state.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const selectWorkflow = useStoreActions((actions) => actions.selectWorkflow);

  return (
    <div className="flex flex-col flex-nowrap flex-1">
      <div className="flex w-full bg-white h-16">
        <div className="flex-col my-auto mx-4">
          <Select
            placeholder="No workflows"
            className="w-60"
            value={workflows[selectedWorkflow].id}
            dropdownClassName="w-60 rounded"
            icon={<WorkflowIcon className="ml-2 w-6" />}
          >
            {workflows.map((workflow, num) => (
              <option
                value={workflow.id}
                key={workflow.id}
                onChange={() => selectWorkflow(num)}
              >
                {workflow.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {selectedWorkflow > -1 ? (
        <WorkflowPane
          workflow={workflows[selectedWorkflow]}
          bgClassName="bg-circle-gray-200"
          className="border border-r-0 h-full border-b-0 border-circle-gray-300"
        />
      ) : (
        <div className='w-full h-full bg-gray-400'>
          
        </div>
      )}
    </div>
  );
};

export default WorkflowsPane;
