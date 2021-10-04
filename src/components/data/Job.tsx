import { ReactElement } from "react-redux/node_modules/@types/react";
import JobSummary from "../containers/job/JobDefinition";
import { Job as ConfigJob } from "@circleci/circleci-config-sdk";
import { IConfigData } from "./IConfigData";
import { Handle, Node, Position } from "react-flow-renderer";
import Collapsible from "react-collapsible";
import { useStoreState } from "../../state/Hooks";

export interface JobNodeProps extends Node<Job> {
    parameters: any
    job: ConfigJob
}

class Job implements IConfigData<ConfigJob, JobNodeProps> {
    add = (data: ConfigJob) => {

    };

    update = (job: ConfigJob) => {

    };

    remove = (job: ConfigJob) => {

    };

    summary = (job: ConfigJob): ReactElement<any> => {
        return JobSummary();
    }

    node = (props: JobNodeProps): ReactElement<any> => {
        return (
            <div className="p-3 bg-green-600 text-white font-bold rounded-lg">
                <Handle type="target" id="requires" position={Position.Left} style={{ borderRadius: 0 }} />
                <Collapsible trigger={props.parameters.name || props.job.name } triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
                    <Collapsible trigger={props.parameters.name || props.job.name } triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
                        <p>test</p>
                    </Collapsible>
                </Collapsible>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="requiredBy"
                />
            </div>
        );
    };

    propertyForm = (job: ConfigJob): ReactElement<any> => {
        return JobSummary();
    }
}

export default Job;
