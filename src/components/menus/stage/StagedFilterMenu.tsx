import { FilterParameter } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types';
import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Form, Formik, FormikValues } from 'formik';
import { useStoreActions } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import { Button } from '../../atoms/Button';
import ListProperty, {
  ListItemChildProps,
} from '../../atoms/form/ListProperty';
import BreadCrumbs from '../../containers/BreadCrumbs';
import TabbedMenu from '../TabbedMenu';

type WorkflowJobMenuProps = {
  job: WorkflowJob;
  values: any;
};

type FilterListProps = {
  type: 'Only' | 'Ignore';
} & FormikValues;

const FilterItem = ({ item, setValue }: ListItemChildProps) => {
  return (
    <input
      className="w-full h-full p-1"
      defaultValue={item}
      placeholder={'Filter string or regex'}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

/**
 * Create structure of branch filters,
 * and ensure there are at least one empty value
 * per target.
 */
const getInitialValues = (values: {
  parameters?: { filters?: FilterParameter };
}) => {
  const current = values.parameters?.filters;
  const branches = current?.branches;
  const tags = current?.tags;

  const initial = {
    branches: {
      only: branches?.only || [''],
      ignore: branches?.ignore || [''],
    },
    tags: { only: tags?.only || [''], ignore: tags?.ignore || [''] },
  };

  return initial;
};

const FilterList = ({ type, values, target }: FilterListProps) => {
  return (
    <ListProperty
      label={type}
      name={`${target}.${type.toLowerCase()}`}
      values={values}
      expanded
      required
      listItem={FilterItem}
      addButton
    />
  );
};

const StagedFilterMenu = ({ job, values }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const tabs = ['BRANCHES', 'TAGS'];

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto">
      <header>
        <BreadCrumbs />
        {/* <WorkflowIcon className="w-8 h-8 p-1 mr-1" /> */}
        <div className="pl-6 pr-5">
          <h1 className="pt-3 text-2xl font-bold">Filters</h1>
          <div className=" py-3 flex text-sm text-circle-gray-500">
            A map defining rules for execution on specific branches or tags
          </div>
        </div>
      </header>
      <Formik
        initialValues={getInitialValues(values)}
        enableReinitialize
        onSubmit={(values) => {
          navigateBack({
            distance: 1,
            applyValues: (currentValues) => {
              const strip = (list: string[]) => {
                const filtered = list.filter((item) => item);

                return filtered.length > 0 ? filtered : undefined;
              };
              const branches = {
                only: strip(values.branches.only),
                ignore: strip(values.branches.ignore),
              };
              const hasBranches =
                branches.only?.length || branches.ignore?.length;
              const tags = {
                only: strip(values.tags.only),
                ignore: strip(values.tags.ignore),
              };
              const hasTags = tags.only?.length || tags.ignore?.length;

              return {
                ...currentValues,
                parameters: {
                  ...currentValues.parameters,
                  filters:
                    hasBranches || hasTags
                      ? {
                          branches: hasBranches ? branches : undefined,
                          tags: hasTags ? tags : undefined,
                        }
                      : undefined,
                },
              };
            },
          });
        }}
      >
        {(formikProps) => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu tabs={tabs}>
              {['branches', 'tags'].map((target) => (
                <div className="p-6" key={target}>
                  <FilterList
                    type="Only"
                    {...formikProps}
                    target={target}
                  ></FilterList>
                  <FilterList
                    type="Ignore"
                    {...formikProps}
                    target={target}
                  ></FilterList>
                </div>
              ))}
            </TabbedMenu>

            <div className="border-t border-circle-gray-300 p-6 flex">
              <Button
                title='Save filter'
                ariaLabel='Save filter'
                type="submit"
                className="ml-auto"
                variant="primary"
                // disabled={!formikProps.dirty}
              >
                Save Filter
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const StagedFilterMenuNav: NavigationComponent = {
  Component: StagedFilterMenu,
  Label: (props: { expanded: boolean[] }) => <p>Filters</p>,
};

export default StagedFilterMenuNav;
