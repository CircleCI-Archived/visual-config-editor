import Definitions from "../containers/DefinitionsContainer";
import { useStoreActions, useStoreState } from "../../state/Hooks";
import { dataMappings } from "../../data/ConfigData";
import { Config, Workflow } from "@circleci/circleci-config-sdk";

const DefintionsPane = () => {
  /* TODO: DETERMINE PARAMETERS
  const parameters = useStoreState((state) => state.parameters); 
  const defineParameter = useStoreActions((actions) => actions.defineParameter); */
  // const generateConfig = useStoreActions((actions) => actions.generateConfig);
  const defs = useStoreState((state) => state.definitions);
  const workflows = useStoreState((state) => state.workflows);

  const generateConfig = () => {
    const config = new Config(false, [], defs.workflows, defs.executors, defs.commands)

    defs.jobs?.forEach(job => {
      config.addJob(job);
    })

    workflows.forEach(flow => {
      const workflow = new Workflow(flow.name)

      flow.elements.forEach((element) => {
        if (element.type === 'job') {
          workflow.addJob(element.data.job, element.data.parameters);
        }
      })

      config.addWorkflow(workflow)
    })
  }

  return (
    <div className="h-full w-full pt-6 bg-circle-gray-900 flex flex-col">
      <div className="flex border-b border-circle-gray-800">
        <h1 className="border-b-4 text-xl pl-4 pr-4 pb-2 w-max font-bold text-white text-center border-circle-green">
          CONFIG DEFINITIONS
        </h1>
      </div>

      <div className="flex-1 h-full flex-col p-10 ">
        <div className="overflow-y-auto h-full mb-6 rounded-lg">
          {dataMappings.map(mapping => {
            const dataType = mapping.dataType;

            return (<Definitions type={dataType} />)
          })}
        </div>
      </div>

      <button className="text-gray-100 text-2xl p-2 m-6 bg-circle-green duration:50 transition-all rounded-lg"
        onClick={e => generateConfig()}>
        Generate config.yml
      </button>
    </div>)
}

export default DefintionsPane;