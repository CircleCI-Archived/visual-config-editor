import {
  Config,
  parameters,
  Workflow,
  WorkflowJob,
} from '@circleci/circleci-config-sdk';
import { PrimitiveParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/Parameters.types';
import WorkflowIcon from '../../../icons/components/WorkflowIcon';
import { dataMappings } from '../../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import DefinitionsContainer from '../../containers/DefinitionsContainer';
import TabbedMenu from '../TabbedMenu';

/**
 * @see
 * @returns
 */
const DefinitionsMenu = () => {
  /* TODO: DETERMINE PARAMETERS
  const parameters = useStoreState((state) => state.parameters); 
  const defineParameter = useStoreActions((actions) => actions.defineParameter); */
  // const generateConfig = useStoreActions((actions) => actions.generateConfig);
  const defs = useStoreState((state) => state.definitions);
  const workflowGraphs = useStoreState((state) => state.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const updateConfig = useStoreActions((actions) => actions.generateConfig);
  const workflow = workflowGraphs[selectedWorkflow];

  const generateConfig = () => {
    const workflows = workflowGraphs.map((flow) => {
      const jobs = flow.elements
        .filter((element) => element.type === 'job')
        .map(
          (element) =>
            new WorkflowJob(element.data.job, element.data.parameters),
        );

      return new Workflow(flow.name, jobs);
    });

    const config = new Config(
      false,
      defs.jobs,
      workflows,
      defs.executors,
      defs.commands,
      defs.parameters.length > 0
        ? new parameters.CustomParametersList<PrimitiveParameterLiteral>(
            defs.parameters,
          )
        : undefined,
    );

    updateConfig(config);
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto">
      <header className="ml-4 mb-4 flex">
        <WorkflowIcon className="w-8 h-8 p-1 mr-1" />
        <h1 className="text-2xl font-bold">{workflow.name}</h1>
      </header>

      <TabbedMenu tabs={['DEFINITIONS', 'PROPERTIES']}>
        <div className="p-2 flex-1 h-full w-full flex-col">
          {dataMappings.map((mapping) => {
            const dataType = mapping.mapping;

            return (
              <DefinitionsContainer
                type={dataType}
                key={dataType.name.plural}
              />
            );
          })}
        </div>
        <div>properties will go here!</div>
      </TabbedMenu>

      <span className="border-b border-circle-gray-300" />
      <button
        className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
        onClick={(e) => generateConfig()}
      >
        Generate Config
      </button>
    </div>
  );
};

export default DefinitionsMenu;
