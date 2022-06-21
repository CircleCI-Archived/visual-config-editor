import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Form, Formik } from 'formik';
import JobIcon from '../../icons/components/JobIcon';
import { useStoreActions } from '../../state/Hooks';
import { NavigationComponent } from '../../state/Store';
import InspectorProperty from '../atoms/form/InspectorProperty';
import BreadCrumbs from '../containers/BreadCrumbs';
import TabbedMenu from './TabbedMenu';

type WorkflowJobMenuProps = {
  job: WorkflowJob;
};

const JobPropertiesMenu = ({ job }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-2 font-bold">Edit Job Properties</h1>
      </header>
      <Formik
        initialValues={job.parameters || { parameters: undefined }}
        enableReinitialize={true}
        onSubmit={(values) => {
          job.parameters = values;

          navigateBack({
            distance: 1,
          });
        }}
      >
        {(formikProps) => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu tabs={['PROPERTIES']}>
              <div className="p-6">
                <InspectorProperty name="name" label="Name" />
              </div>
            </TabbedMenu>

            <span className="border-b border-circle-gray-300 mt-auto" />
            <button
              type="submit"
              className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
            >
              Save Workflow Job
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const JobPropertiesMenuNav: NavigationComponent = {
  Component: JobPropertiesMenu,
  Label: (props: WorkflowJobMenuProps) => {
    return <p>{props.job.parameters?.name || props.job.name}</p>;
  },
  Icon: (props: WorkflowJobMenuProps) => {
    return <JobIcon className="w-6 h-8 py-2" />;
  },
};

export { JobPropertiesMenu, JobPropertiesMenuNav };
