import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Form, Formik, FormikValues } from 'formik';
import React, { useState } from 'react';
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
      onBlur={(e) => {
        setValue(e.target.value);
      }}
    />
  );
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
      empty="filter "
      addButton
    />
  );
};
const StagedFilterMenu = ({ job }: WorkflowJobMenuProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const tabs = ['BRANCHES', 'TAGS'];
  const [target, setTarget] = useState(tabs[0].toLowerCase());

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
        initialValues={{
          branches: {
            only: [''],
            ignore: [''],
          },
          tags: { only: [''], ignore: [''] },
        }}
        enableReinitialize
        onSubmit={(values) => {
          navigateBack({
            distance: 1,
            applyValues: (currentValues) => {
              const filterEmpty = (values: string[]) => {
                const filtered = values
                  .map((value) => value.trim())
                  .filter((value) => value);

                if (filtered.length > 0) {
                  return filtered;
                }
              };

              const filters = Object.assign(
                {},
                // filter the the empty values from only and ignore lists
                ...Object.entries(values)
                  .map(([targetKey, target]) => ({
                    [targetKey]: Object.entries(target).map(
                      ([typeKey, type]) => ({
                        [typeKey]: filterEmpty(type),
                      }),
                    ),
                  }))
                  // filter out any target types that have no defined values
                  .filter((target) =>
                    Object.values(target).some(
                      (type) =>
                        type && Object.values(Object.values(type)[0])[0],
                    ),
                  ),
              );

              return { ...currentValues, filters };
            },
          });
        }}
      >
        {(formikProps) => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu
              tabs={tabs}
              onChange={(index) => {
                setTarget(tabs[index].toLowerCase());
              }}
            >
              <div className="p-6">
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
            </TabbedMenu>

            <div className="border-t border-circle-gray-300 p-6 flex">
              <Button type="submit" className="ml-auto" variant="primary">
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
