import { Form, Formik } from 'formik';
import BreadCrumbArrowIcon from '../../../icons/ui/BreadCrumbArrowIcon';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel } from '../../../state/Store';
import TabbedMenu from '../TabbedMenu';

const EditDefinitionMenu = (props: DataModel & { values: any }) => {
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

  const getIcon = (className: string) => {
    let iconComponent = dataMapping?.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className={className} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="ml-6">
        <div className="flex items-center">
          <button
            className="text-base text-circle-gray-500"
            onClick={() => {
              navigateBack();
            }}
          >
            Definitions
          </button>
          <BreadCrumbArrowIcon className="pl-1 w-5 h-5" color="#6A6A6A" />
          {getIcon('w-6 h-8 py-2')}
          <p className="ml-1 font-medium leading-6 tracking-tight">
            Edit {dataMapping?.name.singular}
          </p>
        </div>
        <div className="py-3 flex">
          {getIcon('w-8 h-8 p-1 pl-0 mr-1')}
          <h1 className="text-2xl font-bold">
            {props.data.name}
          </h1>
        </div>
      </header>
      {dataMapping && (
        <Formik
          initialValues={props.values || { ...dataMapping.defaults, ...props.data }}
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
              <TabbedMenu tabs={['PROPERTIES', 'PARAMETERS']}>
                <div className="p-6">
                  {dataMapping.components.inspector({
                    ...formikProps,
                    definitions,
                  })}
                </div>
                <div>parameters will go here!</div>
              </TabbedMenu>

              <span className="border border-circle-gray-300 mt-auto" />
              <button
                type="submit"
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
