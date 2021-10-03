import { Handle, Position } from 'react-flow-renderer';
import Collapsible from 'react-collapsible';

export interface JobNodeProps {
    label: string
    id: string
    jobRef: string
}

const JobNode = (job: JobNodeProps) => {
    return (
        <div className="p-3 bg-green-600 text-white font-bold rounded-lg">
            <Handle type="target" id="requires" position={Position.Left} style={{ borderRadius: 0 }} />
            <Collapsible trigger={job.label} triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
                <Collapsible trigger={job.label} triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
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

export default JobNode;