import { reusable } from '@circleci/circleci-config-sdk';
import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Form, Formik } from 'formik';
import JobIcon from '../../icons/components/JobIcon';
import { useStoreActions } from '../../state/Hooks';
import { NavigationComponent } from '../../state/Store';
import InspectorProperty from '../atoms/form/InspectorProperty';
import ListProperty from '../atoms/form/ListProperty';
import StepListItem from '../atoms/form/StepListItem';
import BreadCrumbs from '../containers/BreadCrumbs';
import ParamListContainer from '../containers/ParamListContainer';
import { StepDefinitionMenu } from './definitions/StepDefinitionMenu';
import StepTypePageNav from './definitions/subtypes/StepTypePage';
import StagedFilterMenuNav from './stage/StagedFilterMenu';
import { navSubTypeMenu } from './SubTypeMenu';
import TabbedMenu from './TabbedMenu';

type WorkflowJobMenuProps = {
  job: WorkflowJob;
};

const StagedJobMenu = ({ job }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-2 font-bold">Edit Staged Job</h1>
      </header>
      <Formik
        initialValues={{
          name: job.name,
          parameters: { name: '', pre_steps: [], ...job.parameters },
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
                </button>
                {job.job instanceof reusable.ParameterizedJob && (
                  <div className="bg-red w-full">
                    <ParamListContainer
                      paramList={job.job.parameters}
                    ></ParamListContainer>
                  </div>
                )}

                <ListProperty
                  label="Pre-steps"
                  name="parameters.pre_steps"
                  expanded
                  required
                  listItem={StepListItem}
                  emptyText="No steps defined yet."
                  titleExpanded={
                    <button
                      type="button"
                      onClick={() => {
                        navigateTo(
                          navSubTypeMenu(
                            {
                              typePage: StepTypePageNav,
                              menuPage: StepDefinitionMenu,
                              menuProps: {
                                getter: (values: any) =>
                                  values.parameters.pre_steps,
                                setter: (values: any, value: any) =>
                                  (values.parameters.pre_steps = value),
                              },
                            },
                            job,
                          ),
                        );
                      }}
                      className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
                    >
                      New
                    </button>
                  }
                ></ListProperty>
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
