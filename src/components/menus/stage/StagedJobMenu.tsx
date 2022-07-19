import { orb, reusable } from '@circleci/circleci-config-sdk';
import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { WorkflowJobParameters } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow/types';
import { Form, Formik } from 'formik';
import JobIcon from '../../../icons/components/JobIcon';
import { useStoreActions } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import BreadCrumbs from '../../containers/BreadCrumbs';
import ParamListContainer from '../../containers/ParamListContainer';
import TabbedMenu from '../TabbedMenu';

type WorkflowJobMenuProps = {
  job: WorkflowJob;
};

const StagedJobMenu = ({ job }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  // const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const updateConfirmation = useStoreActions(
    (actions) => actions.updateConfirmation,
  );

  const onDelete = () => {
    alert('delete');
    navigateBack({
      distance: 1,
    });
  };
  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-2 font-bold">Edit Staged Job</h1>
      </header>
      <Formik
        initialValues={{
          name: job.name,
          parameters: { name: undefined, ...job.parameters },
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
                {/**
                  TODO: Replace with collapsible list
                  <button
                  type="button"
                  className=" text-sm font-medium p-2 w-full bg-circle-gray-200 duration:50 transition-all rounded-md2"
                  onClick={() => {
                    navigateTo({
                      component: StagedFilterMenuNav,
                      props: { job },
                      origin: true,
                    });
                  }}
                >
                  Edit Filters
                </button> */}
                {(job.job instanceof reusable.ParameterizedJob ||
                  job.job instanceof orb.OrbRef) && (
                  <ParamListContainer
                    parent="parameters"
                    paramList={job.job.parameters}
                  ></ParamListContainer>
                )}
              </div>
            </TabbedMenu>

            <span className="border-b border-circle-gray-300 mt-auto" />
            <div className="display: flex	align-items: center justify-content: center">
              <button
                type="button"
                onClick={() => {
                  navigateBack({
                    distance: 1,
                  });
                }}
                className="text-white text-sm font-medium p-2 m-6 bg-circle-red duration:50 transition-all rounded-md2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateConfirmation({
                    type: 'delete',
                    onConfirm: () => onDelete(),
                  });
                }}
                className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
              >
                Delete
              </button>
              <button
                type="submit"
                className="text-white text-sm font-medium p-2 m-6 bg-circle-green duration:50 transition-all rounded-md2"
              >
                Save
              </button>
            </div>
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
