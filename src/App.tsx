import { createStore, StoreProvider } from 'easy-peasy';
import EditorPane from './components/panes/EditorPane';
import NavigationPane from './components/panes/NavigationPane';
import WorkflowsPane from './components/panes/WorkflowsPane';
import Store from './state/Store';

const App = () => {
  return (
    <StoreProvider store={createStore(Store)}>
      <section className="flex flex-row h-full">
        <section className="flex flex-col flex-nowrap flex-1">
          <WorkflowsPane />
          <EditorPane />
        </section>
        <NavigationPane />
      </section>
    </StoreProvider>
  );
};

export default App;
