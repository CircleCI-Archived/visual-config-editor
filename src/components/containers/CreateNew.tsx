import { Formik } from "formik";
import { useStoreActions, useStoreState } from "../../state/Hooks";

export interface CreateNewProps {
  inspector: React.FunctionComponent
}

const CreateNew = () => {
  const inspecting = useStoreState((state) => state.inspecting);
  const inspect = useStoreActions((actions) => actions.inspect)
  const configData = inspecting.dataType;
  const add = useStoreActions((actions) => configData?.store.add(actions) || actions.error);

  const getInspector = () => {
    if (configData) {
      return <Formik initialValues={configData.defaults}
        onSubmit={(values) => {
          console.log(values)
          add(configData.transform(values))
        }}>
        {configData.components.inspector}
      </Formik>
    }
  }

  return (
    <div className={inspecting?.mode != 'creating' ? 'hidden' : ''
      + 'absolute w-full h-full flex items-center justify-center bg-opacity-75 bg-black z-50 transition-all'}>
      <div className="bg-circle-gray-100 rounded-lg w-1/2 h-1/2">
        <div className="w-full h-14 bg-circle-green rounded-t-lg float-left p-2">
          <h1 className="float-left ml-3 mt-1 text-white font-semibold text-3xl">CREATE NEW {inspecting?.dataType?.name.singular.toUpperCase()}</h1>
          <button onClick={() => inspect({ mode: 'none' })} className="pl-2 mt-1 pr-2 rounded-full float-right text-none text-2xl transition-colors hover:bg-circle-red">
            X
          </button>
        </div>

        {getInspector()}
      </div>
    </div>
  );
}

export default CreateNew;