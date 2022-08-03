import { orb, parsers, reusable } from '@circleci/circleci-config-sdk';
import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Form, Formik } from 'formik';
import CommandIcon from '../../../icons/components/CommandIcon';
import JobIcon from '../../../icons/components/JobIcon';
import { definitionsAsArray } from '../../../state/DefinitionStore';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import AddButton from '../../atoms/AddButton';
import { Button } from '../../atoms/Button';
import { Empty } from '../../atoms/Empty';
import AdjacentStepListItem from '../../atoms/form/AdjacentStepListItem';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import ListProperty, {
  ListItemChildProps,
} from '../../atoms/form/ListProperty';
import BreadCrumbs from '../../containers/BreadCrumbs';
import ParamListContainer from '../../containers/ParamListContainer';
import { StepDefinitionMenu } from '../definitions/StepDefinitionMenu';
import StepTypePageNav from '../definitions/subtypes/StepTypePage';
import { navSubTypeMenu } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';
import StagedFilterMenuNav from './StagedFilterMenu';

type WorkflowJobMenuProps = {
  source: WorkflowJob;
  values: any;
  id: string;
};

const FilterItem = ({ item, setValue }: ListItemChildProps) => {
  return (
    <input
      className="w-full h-full p-1"
      defaultValue={item}
      placeholder={'Context name'}
      onBlur={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

const AdjacentSteps = ({
  values,
  label,
  type,
}: {
  values: any;
  label: string;
  type: 'pre-steps' | 'post-steps';
}) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <ListProperty
      label={label}
      name={`parameters.${type}`}
      className="pb-4"
      expanded
      required
      listItem={(input) => (
        <AdjacentStepListItem {...input} values={values} type={type} />
      )}
      empty={
        <Empty
          label={`No ${label} Yet`}
          Logo={CommandIcon}
          description="Add a step by clicking the button above"
        />
      }
      pinned={
        <AddButton
          className="ml-auto flex"
          onClick={() => {
            navigateTo(
              navSubTypeMenu(
                {
                  typePage: StepTypePageNav,
                  menuPage: StepDefinitionMenu,
                  menuProps: {
                    getter: (values: any) => values.parameters[type],
                    setter: (values: any, value: any) =>
                      (values.parameters[type] = value),
                  },
                },
                values,
              ),
            );
          }}
        />
      }
    />
  );
};

const StagedJobMenu = ({ source, values, id }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
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
          parameters: {
            name: '',
            context: [''],
            ...values.parameters,
          },
        }}
        enableReinitialize
        onSubmit={(values) => {
          const update = parsers.parseWorkflowJob(
            source.name,
            Object.assign(
              {},
              ...Object.entries(values.parameters).map(([key, value]) =>
                value ? { [key]: value } : undefined,
              ),
            ),
            definitionsAsArray(definitions.jobs),
            definitionsAsArray(definitions.orbs),
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
                <ListProperty
                  label="Contexts"
                  name="parameters.context"
                  values={values}
                  expanded
                  required
                  listItem={FilterItem}
                  empty="filter "
                  addButton
                />
                <button
                  type="button"
                  className=" text-sm font-medium p-2 w-full bg-circle-gray-200 duration:50 transition-all rounded-md2"
                  onClick={() => {
                    navigateTo({
                      component: StagedFilterMenuNav,
                      props: { source, values },
                      values,
                    });
                  }}
                >
                  Edit Filters
                </button>
                {(source.job instanceof reusable.ParameterizedJob ||
                  source.job instanceof orb.OrbRef) && (
                  <>
                    <ParamListContainer
                      parent="parameters"
                      paramList={source.job.parameters}
                    ></ParamListContainer>
                  </>
                )}
                <AdjacentSteps
                  values={values}
                  label="Pre-steps"
                  type="pre-steps"
                />
                <AdjacentSteps
                  values={values}
                  label="Post-steps"
                  type="post-steps"
                />
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
