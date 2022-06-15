import { createStore, StoreProvider } from 'easy-peasy';
import EditorPane from './components/panes/EditorPane';
import NavigationPane from './components/panes/NavigationPane';
import WorkflowsPane from './components/panes/WorkflowsPane';
import useWindowDimensions from './state/Hooks';
import Store from './state/Store';

const App = () => {
  const inspectorWidth = 320;
  const appWidth = useWindowDimensions();

  return (
    <StoreProvider store={createStore(Store)}>
      <section className="flex flex-row h-full">
        <section
          className="flex flex-col flex-nowrap flex-1"
          style={{ width: appWidth.width - inspectorWidth }}
        >
          <WorkflowsPane />
          <EditorPane />
        </section>
        <NavigationPane width={inspectorWidth} />
      </section>
    </StoreProvider>
  );
};

export default App;
