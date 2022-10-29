import Logo from '../../icons/ui/Logo';
import HeaderMenu from '../containers/HeaderMenu';
// import WorkflowContainer from '../containers/WorkflowContainer';
import { FlowProvided } from '../flow/Flow';

const WorkflowsPane = () => {
  return (
    <div
      arial-label="Workflows Pane"
      className="flex flex-col flex-nowrap flex-1"
      id="Workflows-Pane"
    >
      <header className="flex w-full bg-white h-16">
        <div className="p-2 flex flex-row my-auto w-full">
          <div className="my-auto flex flex-row">
            <Logo className="mx-2" />
            <h1 className="text-xl font-bold">Visual Config Editor</h1>
          </div>
        </div>
        <HeaderMenu />
      </header>
      {/* <WorkflowContainer
        bgClassName="bg-circle-gray-200"
        className="border border-r-0 h-full border-b-0 border-circle-gray-300"
      /> */}
      <FlowProvided className="border border-r-0 h-full border-b-0 border-circle-gray-300"></FlowProvided>
    </div>
  );
};

export default WorkflowsPane;
