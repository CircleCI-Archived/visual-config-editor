import Definitions from "../containers/Definitions";
import ExecutorsIcon from "../../icons/ExecutorsIcon";
import JobIcon from "../../icons/JobIcon";
import OrbIcon from "../../icons/OrbIcon";
import CommandIcon from "../../icons/CommandIcon";
import ParameterIcon from "../../icons/ParameterIcon";

const DefintionsPane = () => {
    return (
        <div className="h-full w-full pt-6 bg-circle-gray-900 flex flex-col">
            <div className="flex border-b border-circle-gray-800">
                <h1 className="border-b-4 text-xl pl-4 pr-4 pb-2 w-max font-bold text-white text-center border-circle-green">
                    CONFIG DEFINITIONS
                </h1>
            </div>

            <div className="flex-1 h-full flex-col p-10 ">
                <div className="overflow-y-auto h-full mb-6 rounded-lg">
                    <Definitions defintionTitle="Orbs"
                        icon={<OrbIcon viewBox="0 0 20 20" className="ml-1 mr-3 w-8 h-8 float-left" />}
                        items={["config.yml", "node", "slack"]}
                        addNewPlaceholder="Search orbs"></Definitions>

                    <Definitions defintionTitle="Executors"
                        icon={<ExecutorsIcon viewBox="0 0 96 96" className="ml-1 mr-3 w-8 h-8 float-left" />}
                        items={["ubuntu docker", "ubuntu machine", "xcode 602"]}
                        addNewPlaceholder="Define new executor"></Definitions>

                    <Definitions defintionTitle="Parameters"
                        icon={<ParameterIcon viewBox="0 0 18 18" className="ml-1 mr-3 w-8 h-8 float-left" />}
                        items={["ubuntu docker", "ubuntu machine", "xcode 602"]}
                        addNewPlaceholder="Define new parameter"></Definitions>

                    <Definitions defintionTitle="Jobs"
                        icon={<JobIcon viewBox="0 0 24 24" className="ml-1 mr-3 w-8 h-8" />}
                        items={["build", "test", "deploy"]}
                        addNewPlaceholder="Define new job"></Definitions>

                    <Definitions defintionTitle="Commands"
                        icon={<CommandIcon viewBox="0 0 24 24" className="ml-1 mr-3 w-8 h-8 float-left" />}
                        items={["ubuntu docker", "ubuntu machine", "xcode 602"]}
                        addNewPlaceholder="Define new command"></Definitions>
                </div>
            </div>
            
            <button className="text-gray-100 text-2xl p-2 m-6 bg-circle-green duration:50 transition-all rounded-lg">
                Generate config.yml
            </button>
        </div>)
}

export default DefintionsPane;