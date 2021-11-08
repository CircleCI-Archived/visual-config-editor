import { createStore, StoreProvider } from 'easy-peasy';
import DefinitionsPane from './components/panes/definitions/DefinitionsPane';
import CreateNewPane from './components/panes/definitions/NewDefinitionPane';
import WorkflowsTabbed from './components/panes/WorkflowsPane';
import Store from './state/Store';

const App = () => {
  return (
    <StoreProvider store={createStore(Store)}>
      <CreateNewPane />
      <div className="flex flex-row h-full">
        <WorkflowsTabbed />
        <DefinitionsPane />
      </div>
    </StoreProvider>
  );
};

export default App;
