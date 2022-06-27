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

const StagedJobMenu = ({ job }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-2 font-bold">Edit Staged Job</h1>
      </header>
      <Formik
        initialValues={{
          name: job.name,
          parameters: { name: '', ...job.parameters },
        }}
        enableReinitialize={true}
        onSubmit={(values) => {
          job.parameters = values.parameters;

          navigateBack({
            distance: 1,
          });
        }}
      >
        {(formikProps) => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu tabs={['PROPERTIES']}>
              <div className="p-6">
                <InspectorProperty type="button" name="name" label="Source Job">
                  <button
                    className="w-full mb-2 p-2 text-sm cursor-pointer text-left text-circle-black 
      bg-white border border-circle-gray-300 rounded-md2 flex flex-row"
                  >
                    <JobIcon className="ml-1 mr-2 w-5 h-5" />
                    <p className="leading-5">{job.name}</p>
                  </button>
                </InspectorProperty>
                <InspectorProperty
                  name="parameters.name"
                  label="Name"
                  placeholder={job.name}
                />
              </div>
            </TabbedMenu>

            <span className="border-b border-circle-gray-300 mt-auto" />
            <button
              type="submit"
              className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
            >
              Save Staged Job
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const StagedJobMenuNav: NavigationComponent = {
  Component: StagedJobMenu,
  Label: (props: WorkflowJobMenuProps) => {
    return <p>{props.job.parameters?.name || props.job.name}</p>;
  },
  Icon: (props: WorkflowJobMenuProps) => {
    return <JobIcon className="w-6 h-8 py-2" />;
  },
};

export { StagedJobMenu, StagedJobMenuNav };
