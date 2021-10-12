import { Formik } from "formik";
import { useStoreActions, useStoreState } from "../../state/Hooks";

const InspectorPane = () => {
  const inspecting = useStoreState((state) => state.inspecting);
  const configData = inspecting.dataType;
  const update = useStoreActions((actions) => configData?.store.update(actions) || actions.error);

  const getInspector = () => {
    if (configData) {
      let data = {}

      Object.assign(data, ...Object.keys(inspecting.data).map((key) => {
        const value = inspecting.data[key];

        return { [key]: typeof value == 'object' ? JSON.stringify(value) : value }
      }));

      return <Formik initialValues={data}
        onSubmit={(values) => {
          update({ old: inspecting.data, new: configData.transform(values) })
        }}>
        {configData.components.inspector}
      </Formik>
    }
  }

  if (inspecting && inspecting.dataType && inspecting.mode == 'editing') {
    return <div className="p-5">
      {getInspector()}
    </div>
  }
  return (<p className="text-circle-green-light font-semibold p-5">
    Select a defintion or node to view and edit properties
  </p>)
}

export default InspectorPane;