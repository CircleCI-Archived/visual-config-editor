import { Formik } from 'formik';
import { useStoreActions, useStoreState } from '../../../state/Hooks';

export interface CreateNewProps {
  inspector: React.FunctionComponent;
}

const CreateNewPane = () => {
  const inspecting = useStoreState((state) => state.inspecting);
  const inspect = useStoreActions((actions) => actions.setInspecting);
  const dataMapping = inspecting.dataType;
  const add = useStoreActions(
    (actions) => dataMapping?.store.add(actions) || actions.error,
  );
  const definitions = useStoreState((state) => state.definitions);

  const getInspector = () => {
    if (dataMapping) {
      return (
        <Formik
          initialValues={dataMapping.defaults}
          enableReinitialize={true}
          onSubmit={(values) => {
            add(dataMapping.transform(values, definitions));
            inspect({ mode: 'none', data: undefined, dataType: undefined });
          }}
        >
          {dataMapping.components.inspector(definitions)}
        </Formik>
      );
    }
  };

  return (
    <div
      className={
        inspecting?.mode !== 'creating'
          ? 'hidden'
          : '' +
            'absolute w-full h-full flex items-center justify-center bg-opacity-75 bg-black z-50 transition-all'
      }
    >
      <div className="bg-circle-gray-100 rounded-lg w-max ">
        <div className="w-full h-14 bg-circle-green rounded-t-lg float-left p-2 mb-2">
          <h1 className="float-left ml-2 mt-1 text-white font-semibold text-2xl mr-4">
            Create New {inspecting?.dataType?.name.singular}
          </h1>
          <button
            onClick={() => inspect({ mode: 'none' })}
            className="pl-2 mt-1 pr-2 rounded-full float-right text-none text-2xl transition-colors hover:bg-circle-red"
          >
            X
          </button>
        </div>

        <div className="p-3">{getInspector()}</div>
      </div>
    </div>
  );
};

export default CreateNewPane;
