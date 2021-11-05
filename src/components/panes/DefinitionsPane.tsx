import { Config, Workflow, WorkflowJob } from '@circleci/circleci-config-sdk';
import { dataMappings } from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import DefinitionsContainer from '../containers/DefinitionsContainer';
import InspectorContainer from '../containers/InspectorContainer';

/**
 * @see
 * @returns
 */
const DefintionsPane = () => {
  /* TODO: DETERMINE PARAMETERS
  const parameters = useStoreState((state) => state.parameters); 
  const defineParameter = useStoreActions((actions) => actions.defineParameter); */
  // const generateConfig = useStoreActions((actions) => actions.generateConfig);
  const defs = useStoreState((state) => state.definitions);
  const workflows = useStoreState((state) => state.workflows);
  const updateConfig = useStoreActions((actions) => actions.generateConfig);

  const generateConfig = () => {
    const config = new Config(false, defs.jobs, defs.workflows, defs.commands);

    defs.jobs?.forEach((job) => {
      config.addJob(job);
    });

    defs.executors?.forEach((executor) => {
      config.addReusableExecutor(executor);
    });

    workflows.forEach((flow) => {
      const jobs = flow.elements
        .filter((element) => element.type === 'job')
        .map(
          (element) =>
            new WorkflowJob(element.data.job, element.data.parameters),
        );

      const workflow = new Workflow(flow.name, jobs);

      config.addWorkflow(workflow);
    });

    updateConfig(config);
  };

  return (
    <div className="h-full w-full pt-4 bg-circle-gray-200 flex flex-col overflow-y-auto">
      <div className="flex border-b border-circle-gray-300 m-2">
        <h1 className="border-b-4 text-xl pl-4 pr-4 pb-2 w-max font-bold text-circle-black text-center border-circle-gray-500">
          CONFIG DEFINITIONS
        </h1>
      </div>

      <div className="flex-1 h-full flex-col p-5 ">
        <div className="overflow-y-auto h-full mb-6 rounded-lg">
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
      </div>

      <InspectorContainer />

      <header className="bg-circle-blue p-2 text-center m-auto text-white w-full rounded-lg">
        <h1>
          Visual Config Editor alpha preview 0.1.0 - Features are subject to
          changes
        </h1>
        <h1>
          Find a bug or have any feedback? Please submit an{' '}
          <i>
            <a href="https://github.com/CircleCI-Public/visual-config-editor/issues">
              issue
            </a>
          </i>{' '}
          on our GitHub repository.
        </h1>
      </header>

      <div className="flex border-b border-circle-gray-300 mt-0 m-2" />
      <button
        className="text-gray-100 text-2xl p-2 m-6 bg-circle-blue duration:50 transition-all rounded-lg"
        onClick={(e) => generateConfig()}
      >
        Generate config.yml
      </button>
    </div>
  );
};

export default DefintionsPane;
