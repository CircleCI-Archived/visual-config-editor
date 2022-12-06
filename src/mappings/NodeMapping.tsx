import { Node, NodeProps } from "reactflow";
import { NamedGenerable } from "../core/state/DefinitionStore";

export interface NodeMapping<InType extends NamedGenerable = any,
    ManagedType extends NamedGenerable = any, >
{
    node: {
        /**
         * generated id from managed type
         */
        getId: (data: ManagedType) => string;
        key: string;
        /** Transform definition data */
        transform: (
            data: InType,
            nodes: Node[],
            extras?: any,
        ) => ManagedType;
        /** @todo: Add store functionality to better support updating definitions and their corresponding workflow nodes */
        component: React.FunctionComponent<{ data: ManagedType } & NodeProps>;
    };
}
