import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Collapsible from 'react-collapsible';

export interface JobNodeProps {
    data: {
        label: string
    }
}

const JobNode = ({ data }: JobNodeProps) => {
    return (
        <div className="p-3 bg-green-600 text-white font-bold rounded-lg">
            <Handle type="target" id="requires" position={Position.Left} style={{ borderRadius: 0 }} />
            <Collapsible trigger={data.label} triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
                <Collapsible trigger={data.label} triggerClassName="p-2" triggerOpenedClassName="bg-green-400 p-2 rounded-md" openedClassName="bg-green-200 rounded-md">
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