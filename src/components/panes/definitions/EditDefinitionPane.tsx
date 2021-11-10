import { Formik } from 'formik';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel } from '../../../state/Store';
import TabbedPane from '../TabbedPane';

const EditDefinitionPane = (props: DataModel) => {
  const dataMapping = props.dataType;
  const update = useStoreActions(
    (actions) => dataMapping?.store.update(actions) || actions.error,
  );
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const definitions = useStoreState((state) => state.definitions);

  let submitForm: () => void;

  const getInspector = () => {
    if (dataMapping) {
      return (
        <Formik
          initialValues={{ ...dataMapping.defaults, ...props.data }}
          enableReinitialize
          onSubmit={(values) => {
            update({
              old: props.data,
              new: dataMapping.transform(values, definitions),
            });
            navigateBack();
          }}
        >
          {dataMapping.components.inspector(definitions, (bindForm) => {
            submitForm = bindForm;
          })}
        </Formik>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <TabbedPane tabs={['PROPERTIES', 'PARAMETERS']}>
        <div className="p-5 overflow-y-scroll">{getInspector()}</div>
        <div>parameters will go here!</div>
      </TabbedPane>

      <span className="border border-circle-gray-300 mt-auto" />
      <button
        type="submit"
        onClick={() => {
          submitForm();
        }}
        className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
      >
        Save {dataMapping?.name.singular}
      </button>
    </div>
  );
};

export default EditDefinitionPane;
