import { createStore, StoreProvider } from 'easy-peasy';
import SplitPane from 'react-split-pane';
import CreateNew from './components/containers/CreateNew';
import DefinitionsPane from './components/panes/DefinitionsPane';
import EditorPane from "./components/panes/EditorPane";
import WorkflowsTabbed from './components/panes/WorkflowsTabbed';
import Store from './state/Store';


const App = () => {

  return (
    <StoreProvider store={createStore(Store)} >
      <CreateNew />
      <SplitPane split="vertical" defaultSize="75%" className="bounds bg-circle-gray-300" resizerClassName="z-0 w-0.5 h-full transition duration-500  hover:bg-circle-blue-light cursor-ew-resize">
        <SplitPane split="horizontal" defaultSize="70%" minSize="20%" resizerClassName="h-0.5  flex-col cursor-ns-resize transition duration-500 hover:bg-circle-blue-light">

          <WorkflowsTabbed />
          <EditorPane />
        </SplitPane>
        <DefinitionsPane />
      </SplitPane >
    </StoreProvider>
  );
}

export default App;
