import { createStore, StoreProvider } from 'easy-peasy';
import ConfirmationModal from './components/containers/ConfirmationModal';
import EditorPane from './components/panes/EditorPane';
import NavigationPane from './components/panes/NavigationPane';
import WorkflowsPane from './components/panes/WorkflowsPane';
import useWindowDimensions from './state/Hooks';
import Store from './state/Store';

export const store = createStore(Store);
export const inspectorWidth = 400;

const App = () => {
  const appWidth = useWindowDimensions();

  return (
    <StoreProvider store={store}>
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
      <ConfirmationModal />
    </StoreProvider>
  );
};

export default App;
