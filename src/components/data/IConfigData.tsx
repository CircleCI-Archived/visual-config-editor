import { Node } from "react-flow-renderer";
import { ReactElement } from "react-redux/node_modules/@types/react";

export interface IConfigData<ConfigDataType = any, ConfigNodeProps = any | undefined> {
    add: (data: ConfigDataType) => void; 
    update: (data: ConfigDataType) => void; 
    remove: (data: ConfigDataType) => void; 
    summary: (data: ConfigDataType) => ReactElement<any>; 
    propertyForm: (data: ConfigDataType) => ReactElement<any>; 
    node?: (data: ConfigNodeProps) => ReactElement<any>; 
}