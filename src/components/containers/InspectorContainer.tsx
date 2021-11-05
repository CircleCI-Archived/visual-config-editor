import { Formik } from 'formik';
import { useStoreActions, useStoreState } from '../../state/Hooks';

const InspectorContainer = () => {
  const inspecting = useStoreState((state) => state.inspecting);
  const configData = inspecting.dataType;
  const update = useStoreActions(
    (actions) => configData?.store.update(actions) || actions.error,
  );
  const definitions = useStoreState((state) => state.definitions);

  const getInspector = () => {
    if (configData) {
      return (
        <Formik
          initialValues={{ ...configData.defaults, ...inspecting.data }}
          enableReinitialize
          onSubmit={(values) => {
            update({ old: inspecting.data, new: configData.transform(values, definitions) });
          }}
        >
          {configData.components.inspector(definitions)}
        </Formik>
      );
    }
  };

  if (inspecting && inspecting.dataType && inspecting.mode === 'editing') {
    return (
      <div>
        <div className="flex border-b border-circle-gray-300 m-2 mb-0">
          <h1 className="border-b-4 text-xl pb-2 pl-2 pr-2 w-max font-bold text-circle-black text-center border-circle-gray-500">
            INSPECTOR
          </h1>
        </div>
        <div className="p-5 overflow-y-scroll">{getInspector()}</div>
      </div>
    );
  }
  return <div hidden />;
};

export default InspectorContainer;
