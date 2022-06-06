import { useStoreActions, useStoreState } from '../../state/Hooks';
import WorkflowPane from '../containers/WorkflowContainer';

const WorkflowsPane = () => {
  const workflows = useStoreState((state) => state.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const selectWorkflow = useStoreActions((actions) => actions.selectWorkflow);

  return (
    <div className="flex flex-col flex-nowrap flex-1">
      <div className="flex w-full bg-white h-16">
        <div className="flex-col my-auto mx-4">
          <select className="rounded border border-circle-gray-400 p-2">
            {workflows.map((workflow, num) => (
              <option
                value={workflow.id}
                key={workflow.id}
                onChange={() => selectWorkflow(num)}
              >
                {workflow.name}
              </option>
            ))}
          </select>
        </div>
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
