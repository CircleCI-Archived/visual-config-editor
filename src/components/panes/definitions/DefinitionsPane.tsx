import { Config, parameters, Workflow, WorkflowJob } from '@circleci/circleci-config-sdk';
import { PrimitiveParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/Parameters.types';
import WorkflowIcon from '../../../icons/WorkflowIcon';
import { dataMappings } from '../../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import DefinitionsContainer from '../../containers/DefinitionsContainer';

/**
 * @see
 * @returns
 */
const DefinitionsPane = () => {
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
      new parameters.CustomParametersList<PrimitiveParameterLiteral>(...defs.parameters),
    );

    updateConfig(config);
  };

  return (
    <div className="h-full border-l border-circle-gray-300 w-80 pt-4 bg-white flex flex-col overflow-y-auto">
      <h1 className="ml-4 mb-4 flex">
        <WorkflowIcon className="w-8 h-8 p-1 mr-1" />
        <p className="text-2xl font-bold">{workflow.name}</p>
      </h1>
      <div className="flex border-b border-circle-gray-300">
        <button className="ml-4 border-black border-b-4 text-sm tracking-wide px-3 py-3 font-bold text-circle-black text-center">
          DEFINITIONS
        </button>
        <button className="text-sm tracking-wide px-3 pb-2 font-bold text-circle-gray-600 text-center ">
          PROPERTIES
        </button>
      </div>

      <div className="flex-1 h-full w-full flex-col">
        {dataMappings.map((mapping) => {
          const dataType = mapping.mapping;

          return (
            <DefinitionsContainer type={dataType} key={dataType.name.plural} />
          );
        })}
      </div>

      <span className="border border-circle-gray-300" />
      <button
        className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md"
        onClick={(e) => generateConfig()}
      >
        Generate Config
      </button>
    </div>
  );
};

export default DefinitionsPane;
