import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Form, Formik, FormikValues } from 'formik';
import React, { useState } from 'react';
import { NavigationComponent } from '../../state/Store';
import ListProperty, { ListItemChildProps } from '../atoms/form/ListProperty';
import BreadCrumbs from '../containers/BreadCrumbs';
import TabbedMenu from './TabbedMenu';

type WorkflowJobMenuProps = {
  job: WorkflowJob;
};

type FilterListProps = {
  type: 'Only' | 'Ignore';
} & FormikValues;

const FilterItem = ({ item, index, values }: ListItemChildProps) => {
  return <div>{item}</div>;
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
      emptyText="filter "
    ></ListProperty>
  );
};
const StagedFilterMenu = ({ job }: WorkflowJobMenuProps) => {
  // const navigateBack = useStoreActions((actions) => actions.navigateBack);
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
      <TabbedMenu
        tabs={tabs}
        onChange={(index) => {
          setTarget(tabs[index].toLowerCase());
        }}
      >
        <div className="p-6">
          <Formik
            initialValues={{ branches: { only: ['main'] } }}
            enableReinitialize
            onSubmit={(values) => {}}
          >
            {(formikProps) => (
              <Form className="flex flex-col flex-1">
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
              </Form>
            )}
          </Formik>
        </div>
      </TabbedMenu>

      <span className="border-b border-circle-gray-300" />
      <button
        className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
        onClick={(e) => {}} // TODO: implement
      >
        Save Filter
      </button>
    </div>
  );
};

const StagedFilterMenuNav: NavigationComponent = {
  Component: StagedFilterMenu,
  Label: (props: { expanded: boolean[] }) => <p>Filters</p>,
};

export default StagedFilterMenuNav;
