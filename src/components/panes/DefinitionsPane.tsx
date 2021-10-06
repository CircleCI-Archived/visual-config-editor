import Definitions from "../containers/DefinitionsContainer";
import { useStoreActions, useStoreState } from "../../state/Hooks";
import { dataMappings } from "../../data/ConfigData";

const DefintionsPane = () => {
  const orbs = useStoreState((state) => state.definitions.orbs);
  const executors = useStoreState((state) => state.definitions.executors);
  const commands = useStoreState((state) => state.definitions.commands);
  const jobs = useStoreState((state) => state.definitions.jobs);
  const importOrb = useStoreActions((actions) => actions.importOrb);
  const defineExecutor = useStoreActions((actions) => actions.defineExecutor);
  /* TODO: DETERMINE PARAMETERS
  const parameters = useStoreState((state) => state.parameters); 
  const defineParameter = useStoreActions((actions) => actions.defineParameter); */
  const defineCommand = useStoreActions((actions) => actions.defineCommand);
  const defineJob = useStoreActions((actions) => actions.defineJob);

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

      <button className="text-gray-100 text-2xl p-2 m-6 bg-circle-green duration:50 transition-all rounded-lg">
        Generate config.yml
      </button>
    </div>)
}

export default DefintionsPane;