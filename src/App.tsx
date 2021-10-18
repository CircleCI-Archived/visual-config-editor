import { createStore, StoreProvider } from 'easy-peasy';
import SplitPane from 'react-split-pane';
import CreateNew from './components/containers/CreateNewContainer';
import DefinitionsPane from './components/panes/DefinitionsPane';
import EditorPane from "./components/panes/EditorPane";
import WorkflowsTabbed from './components/panes/WorkflowsPane';
import Store from './state/Store';


const App = () => {

  return (
    <StoreProvider store={createStore(Store)} >
      <header className="bg-circle-blue p-2 text-center text-white">
        <h1>Visual Config Editor alpha preview 0.1.0 - Features are subject to changes</h1>
        <h1>Find a bug or have any feedback? Please submit an <i><a href="https://github.com/CircleCI-Public/visual-config-editor/issues">issue</a></i> on our GitHub repository.</h1>
      </header>
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
