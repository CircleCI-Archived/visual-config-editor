import { Form, Formik } from 'formik';
import BreadCrumbArrowIcon from '../../icons/ui/BreadCrumbArrowIcon';
import ComponentMapping from '../../mappings/ComponentMapping';
import JobMapping from '../../mappings/JobMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { commandSubtypes } from '../containers/inspector/subtypes/CommandSubtypes';
import TabbedMenu from './TabbedMenu';

const StepPropertiesMenu = (props: { subtype: string }) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const navigation = useStoreState((state) => state.navigation);
  const subtype = commandSubtypes[props.subtype];

  const getIcon = (mapping: ComponentMapping, className: string) => {
    let iconComponent = mapping?.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className={className} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="ml-6 ">
        {/* <WorkflowIcon className="w-6 h-6 mr-1" color="#6A6A6A" /> */}
        <nav className="flex items-center">
          <button
            className="text-base text-circle-gray-500"
            type="button"
            onClick={() => {
              navigateBack({ distance: 3 });
            }}
          >
            Definitions
          </button>
          <BreadCrumbArrowIcon className="pl-1 w-5 h-5" color="#6A6A6A" />
          {getIcon(JobMapping, 'w-6 h-8 py-2')}
          <button
            className="ml-1 font-medium leading-8 tracking-tight text-circle-gray-500"
            type="button"
            onClick={() => {
              navigateBack({ distance: 2 });
            }}
          >
            New Job
          </button>
          <BreadCrumbArrowIcon className="pl-1 w-5 h-5" color="#6A6A6A" />
          <p className="ml-1 font-medium leading-8 tracking-tight">New Step</p>
        </nav>
        <h1 className="text-2xl py-2 font-bold">New Step</h1>
      </header>
      <Formik
        initialValues={{ parameters: {}}}
        enableReinitialize={true}
        onSubmit={(parameters) => {
          navigateBack({
            distance: 2,
            apply: (values: any) => {
              values.steps = [...values.steps, subtype.generate(parameters)];

              return values;
            },
          });
        }}
      >
        {(formikProps) => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu tabs={['PROPERTIES']}>
              <div className="p-6">
                <button
                  className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
                  type="button"
                  onClick={() => {
                    navigateBack();
                  }}
                >
                  <p className="font-bold">{subtype.text}</p>
                  <p className="text-sm mt-1 leading-4 text-circle-gray-500">
                    {subtype.description}
                  </p>
                </button>
                {subtype.fields}
              </div>
            </TabbedMenu>

            <span className="border-b border-circle-gray-300 mt-auto" />
            <button
              type="submit"
              className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
            >
              Save Step
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPropertiesMenu;
