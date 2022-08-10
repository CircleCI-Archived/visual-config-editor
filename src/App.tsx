import { createStore, StoreProvider } from 'easy-peasy';
import { useRef } from 'react';
import ConfirmationModal from './components/containers/ConfirmationModal';
import KBarList from './components/containers/KBarList';
import EditorPane from './components/panes/EditorPane';
import NavigationPane from './components/panes/NavigationPane';
import WorkflowsPane from './components/panes/WorkflowsPane';
import './index.css';
import useWindowDimensions from './state/Hooks';
import Store from './state/Store';
export const store = createStore(Store);
export const inspectorWidth = 400;

const App = () => {
  const appWidth = useWindowDimensions();
  const editorPane = useRef(null);

  return (
    <StoreProvider store={store}>
      <div className="z-50">
        <KBarList reference={editorPane} />
      </div>
      <section className="flex flex-row h-full text-circle-black ">
        <section
          className="flex flex-col flex-nowrap flex-1"
          style={{ width: appWidth.width - inspectorWidth }}
        >
          <WorkflowsPane />
          <EditorPane />
        </section>
        <NavigationPane />
      </section>

      <ConfirmationModal />
    </StoreProvider>
  );
};

export default App;
