import algoliasearch from 'algoliasearch';
import { createStore, StoreProvider } from 'easy-peasy';
import { useRef } from 'react';
import Toast from './core/components/atoms/Toast';
import ToolTip from './core/components/atoms/Tooltip';
import ConfirmationModal from './core/components/containers/ConfirmationModal';
import KBarList from './core/components/containers/KBarList';
import EditorPane from './core/components/panes/EditorPane';
import NavigationPane from './core/components/panes/NavigationPane';
import WorkflowsPane from './core/components/panes/WorkflowsPane';
import './index.css';
import useWindowDimensions, { useStoreState } from './core/state/Hooks';
import Store from './core/state/Store';
export const store = createStore(Store);
export const inspectorWidth = 400;

export const searchClient = algoliasearch(
  'U0RXNGRK45',
  '798b0e1407310a2b54b566250592b3fd',
);

const Pinned = () => {
  const tooltip = useStoreState((state) => state.tooltip);
  return (
    <div className="z-40 fixed">
      {tooltip && (
        <ToolTip target={tooltip.ref} facing={tooltip.facing}>
          <p>{tooltip.description}</p>
        </ToolTip>
      )}
      <Toast
        className="p-6 fixed bottom-0 right-0 my-20"
        style={{ width: inspectorWidth }}
      />
    </div>
  );
};

const App = () => {
  const appWidth = useWindowDimensions();
  const editorPane = useRef(null);

  return (
    <StoreProvider store={store}>
      <Pinned />
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
      <div className="z-50">
        <KBarList reference={editorPane} />
      </div>
      <ConfirmationModal />
    </StoreProvider>
  );
};

export default App;
