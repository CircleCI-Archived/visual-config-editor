import Definitions from "../containers/Definitions";
import ExecutorsIcon from "../../icons/ExecutorsIcon";
import JobIcon from "../../icons/JobIcon";
import OrbIcon from "../../icons/OrbIcon";

const DefintionsPane = () => {
    return (<div className="h-full flex flex-col w-full bg-circle-gray-900 p-10 ">
        <h1 className="text-center text-3xl text-white mb-6"> Config Definitions </h1>

        <Definitions defintionTitle="Orbs"
            icon={<OrbIcon viewBox="0 0 20 20" className="ml-1 mr-3 w-8 h-8 float-left" />}
            items={["config.yml", "node", "slack"]}
            addNewPlaceholder="Search orbs"></Definitions>

        <Definitions defintionTitle="Executors"
            icon={<ExecutorsIcon viewBox="0 0 96 96" className="ml-1 mr-3 w-8 h-8 float-left" />}
            items={["ubuntu docker", "ubuntu machine", "xcode 602"]}
            addNewPlaceholder="Define new executor"></Definitions>

        <Definitions defintionTitle="Parameters"
            icon={<ExecutorsIcon viewBox="0 0 96 96" className="ml-1 mr-3 w-8 h-8 float-left" />}
            items={["ubuntu docker", "ubuntu machine", "xcode 602"]}
            addNewPlaceholder="Define new executor"></Definitions>

        <Definitions defintionTitle="Jobs"
            icon={<JobIcon viewBox="0 0 24 24" className="ml-1 mr-3 w-8 h-8" />}
            items={["build", "test", "deploy"]}
            addNewPlaceholder="Define new job"></Definitions>

        <Definitions defintionTitle="Commands"
            icon={<ExecutorsIcon viewBox="0 0 96 96" className="ml-1 mr-3 w-8 h-8 float-left" />}
            items={["ubuntu docker", "ubuntu machine", "xcode 602"]}
            addNewPlaceholder="Define new executor"></Definitions>

        <button className="mt-auto text-gray-100 text-2xl p-2 bg-circle-green duration:50 transition-all w-full rounded-lg">
            Export Config
        </button>
    </div>)
}

export default DefintionsPane;