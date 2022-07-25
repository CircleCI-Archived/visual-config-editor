import { Job, orb, parsers, reusable } from '@circleci/circleci-config-sdk';
import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Form, Formik } from 'formik';
import JobIcon from '../../../icons/components/JobIcon';
import { definitionsAsArray } from '../../../state/DefinitionStore';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import { Button } from '../../atoms/Button';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import BreadCrumbs from '../../containers/BreadCrumbs';
import ParamListContainer from '../../containers/ParamListContainer';
import TabbedMenu from '../TabbedMenu';

type WorkflowJobMenuProps = {
  source: Job;
  values: any;
  id: string;
  job: WorkflowJob;
};

const StagedJobMenu = ({ source, values, id }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const definitions = useStoreState((state) => state.definitions);
  const updateWorkflowElement = useStoreActions(
    (actions) => actions.updateWorkflowElement,
  );

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-2 font-bold">Edit Staged Job</h1>
      </header>
      <Formik
        initialValues={{
          parameters: { name: '', ...values.parameters },
        }}
        enableReinitialize
        onSubmit={(values) => {
          const update = parsers.parseWorkflowJob(
            source.name,
            values.parameters,
            definitionsAsArray(definitions.jobs),
          );

          updateWorkflowElement({
            id,
            data: update,
          });

          navigateBack({
            distance: 1,
          });
        }}
      >
        {() => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu tabs={['PROPERTIES']}>
              <div className="p-6">
                <InspectorProperty type="button" name="name" label="Source Job">
                  <div
                    className="w-full mb-2 p-2 text-sm  text-left text-circle-black 
                  bg-circle-gray-200 border border-circle-gray-300 rounded-md2 flex flex-row"
                  >
                    <JobIcon className="ml-1 mr-2 w-5 h-5" />
                    <p className="leading-5">{source.name}</p>
                  </div>
                </InspectorProperty>
                <InspectorProperty
                  name="parameters.name"
                  label="Name"
                  placeholder={source.name}
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

                {(source instanceof reusable.ParameterizedJob ||
                  source instanceof orb.OrbRef) && (
                  <ParamListContainer
                    parent="parameters"
                    paramList={source.parameters}
                  ></ParamListContainer>
                )}
              </div>
            </TabbedMenu>

            <span className="border-b border-circle-gray-300 mt-auto" />
            <div className="flex flex-row ml-auto center py-6 mr-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  navigateBack({
                    distance: 1,
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
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
    return <p>{props.values.parameters?.name || props.source.name}</p>;
  },
  Icon: (props: WorkflowJobMenuProps) => {
    return <JobIcon className="w-6 h-8 py-2" />;
  },
};

export { StagedJobMenu, StagedJobMenuNav };
