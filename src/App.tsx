import SplitPane from 'react-split-pane';
import DefinitionsPane from './components/panes/DefinitionsPane'
import WorkflowsTabbed from './components/panes/WorkflowsTabbed';
import { createStore, StoreProvider } from 'easy-peasy';
import Store from './state/Store';
import CreateNew from './components/containers/CreateNew';
import { useStoreActions, useStoreState } from './state/Hooks';
import InspectorPane from './components/panes/InspectorPane';

const App = () => {
  return (
    <StoreProvider store={createStore(Store)} >

      <CreateNew />
      <SplitPane split="vertical" defaultSize="75%" className="bounds bg-circle-gray-700" resizerClassName="z-0 w-0.5 h-full transition duration-500  hover:bg-circle-blue-light cursor-ew-resize">
        <SplitPane split="horizontal" defaultSize="70%" minSize="20%"
          resizerClassName="h-0.5  flex-col cursor-ns-resize transition duration-500 hover:bg-circle-blue-light">

          <WorkflowsTabbed />

          <div className='bg-circle-gray-900 w-full h-full border-r-2 border-circle-green-light'>
            <div className="inline-flex border-b text-xl  pt-4 pb-0 border-circle-gray-800 w-full font-bold">
              <div className="border-b-4 pl-4 pr-4 pb-2 w-max text-white border-circle-green">
                INSPECTOR
              </div>
              <div className="pl-4 pr-4 pb-2 w-max text-circle-gray-500 hover:text-white transition-colors cursor-pointer">
                CODE EDITOR
              </div>
            </div>

            <InspectorPane />

          </div>
        </SplitPane>

        <DefinitionsPane />
      </SplitPane >
    </StoreProvider>
  );
}

export default App;
