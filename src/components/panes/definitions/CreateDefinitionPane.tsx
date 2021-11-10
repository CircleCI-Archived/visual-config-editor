import { Formik } from 'formik';
import BreadCrumbArrowIcon from '../../../icons/ui/BreadCrumbArrowIcon';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel } from '../../../state/Store';
import TabbedPane from '../TabbedPane';

const CreateDefinitionPane = (props: DataModel) => {
  const definitions = useStoreState((state) => state.definitions);
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const dataMapping = props.dataType;
  const add = useStoreActions(
    (actions) => dataMapping?.store.add(actions) || actions.error,
  );

  const getIcon = (className: string) => {
    let iconComponent = dataMapping?.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className={className} />;
    }
  };

  let submitForm: () => void;

  const getInspector = () => {
    if (dataMapping) {
      return (
        <Formik
          initialValues={dataMapping.defaults}
          enableReinitialize={true}
          onSubmit={(values) => {
            add(dataMapping.transform(values, definitions));
            navigateBack();
          }}
          // pass the save button to the form
        >
          {dataMapping.components.inspector(
            definitions,
            (bindForm) => { submitForm = bindForm },
          )}
        </Formik>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="ml-6">
        <div className="flex items-center">
          {/* <WorkflowIcon className="w-6 h-6 mr-1" color="#6A6A6A" /> */}
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
          <p className="ml-1 font-medium leading-8 tracking-tight">
            New {dataMapping?.name.singular}
          </p>
        </div>
        <div className="py-3 flex">
          {getIcon('w-8 h-8 p-1 pl-0 mr-1')}
          <h1 className="text-2xl font-bold">
            New {dataMapping?.name.singular}
          </h1>
        </div>
      </header>
      <TabbedPane tabs={['PROPERTIES', 'PARAMETERS']}>
        <div className="p-6">{getInspector()}</div>
        <div>params</div>
      </TabbedPane>

      <span className="border border-circle-gray-300 mt-auto" />
      <button type="submit" onClick={() => { submitForm()}} className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2">
        Save {dataMapping?.name.singular}
      </button>
    </div>
  );
};

export default CreateDefinitionPane;
