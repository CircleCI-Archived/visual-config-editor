import { createStore, StoreProvider } from 'easy-peasy';
import ConfirmationModal from './components/containers/ConfirmationModal';
import EditorPane from './components/panes/EditorPane';
import NavigationPane from './components/panes/NavigationPane';
import WorkflowsPane from './components/panes/WorkflowsPane';
import useWindowDimensions from './state/Hooks';
import Store from './state/Store';
import KBarList from './components/containers/KBarList';
import './index.css';
import React, { useRef } from 'react';
import { workflow } from '@circleci/circleci-config-sdk';
export const store = createStore(Store);
export const inspectorWidth = 400;

const App = () => {
  const appWidth = useWindowDimensions();
  const workflowPane = useRef(null);
  const editorPane = useRef(null);
  const navigationPane = useRef(null);

  return (
    <StoreProvider store={store}>
      <section className="flex flex-row h-full text-circle-black ">
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
      <KBarList reference={editorPane} />
    </StoreProvider>
  );
};

export default App;
