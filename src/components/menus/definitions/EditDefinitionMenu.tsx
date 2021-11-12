import { Form, Formik } from 'formik';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel } from '../../../state/Store';
import TabbedMenu from '../TabbedMenu';

const EditDefinitionMenu = (props: DataModel) => {
  const dataMapping = props.dataType;
  const update = useStoreActions(
    (actions) => dataMapping?.store.update(actions) || actions.error,
  );
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const definitions = useStoreState((state) => state.definitions);

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
        ></Formik>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {dataMapping && (
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
          {(formikProps) => (
            <Form className="flex flex-col flex-1">
              {dataMapping.components.inspector({
                ...formikProps,
                definitions,
              })}
              <TabbedMenu tabs={['PROPERTIES', 'PARAMETERS']}>
                <div className="p-5 overflow-y-scroll">{getInspector()}</div>
                <div>parameters will go here!</div>
              </TabbedMenu>

              <span className="border border-circle-gray-300 mt-auto" />
              <button
                type="submit"
                onClick={() => {
                  formikProps.handleSubmit();
                }}
                className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
              >
                Save {dataMapping?.name.singular}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default EditDefinitionMenu;
