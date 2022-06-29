import { Form, Formik } from 'formik';
import React from 'react';
import WorkflowIcon from '../../../icons/components/WorkflowIcon';
import { dataMappings } from '../../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import DefinitionsContainer from '../../containers/DefinitionsContainer';
import OrbImportsContainer from '../../containers/OrbImportsContainer';
import ToastContainer from '../../atoms/ToastContainer';
import TabbedMenu from '../TabbedMenu';

/**
 * @see
 * @returns
 */

const DefinitionsMenu = (props: { expanded: boolean[] }) => {
  /* TODO: DETERMINE PARAMETERS
  const parameters = useStoreState((state) => state.parameters); 
  const defineParameter = useStoreActions((actions) => actions.defineParameter); */
  // const generateConfig = useStoreActions((actions) => actions.generateConfig);
  const workflowGraphs = useStoreState((state) => state.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const updateConfig = useStoreActions((actions) => actions.generateConfig);
  const persistProps = useStoreActions((actions) => actions.persistProps);
  const workflow = workflowGraphs[selectedWorkflow];

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto">
      <header className="ml-4 mb-4 flex">
        <WorkflowIcon className="w-8 h-8 p-1 mr-1" />
        <h1 className="text-2xl font-bold">{workflow.name}</h1>
      </header>

      <TabbedMenu tabs={['DEFINITIONS', 'PROPERTIES']}>
        <div className="p-2 flex-1 h-full w-full flex-col">
          <OrbImportsContainer></OrbImportsContainer>
          {dataMappings.map((mapping, index) => {
            const dataType = mapping.mapping;

            return (
              <DefinitionsContainer
                type={dataType}
                expanded={props.expanded[index]}
                onChange={(isExpanded) => {
                  persistProps({
                    ...props,
                    expanded: props.expanded.map((expanded, i) =>
                      i === index ? isExpanded : expanded,
                    ),
                  });
                }}
                key={dataType.name.plural}
              />
            );
          })}
        </div>
        <div className="p-6">
          <Formik
            initialValues={{ name: workflow.name }}
            enableReinitialize
            onSubmit={(values) => {}}
          >
            {(formikProps) => (
              <Form className="flex flex-col flex-1">
                <InspectorProperty label="Name" name="name" />
              </Form>
            )}
          </Formik>
        </div>
      </TabbedMenu>
      <span className="border-b border-circle-gray-300" />
      <button
        className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
        onClick={(e) => updateConfig()}
      >
        Generate Config
      </button>
    </div>
  );
};

const DefinitionsMenuNav: NavigationComponent = {
  Component: DefinitionsMenu,
  Label: (props: { expanded: boolean[] }) => <p>Definitions</p>,
};

export default DefinitionsMenuNav;
