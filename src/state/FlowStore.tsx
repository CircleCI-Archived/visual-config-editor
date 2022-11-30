import { Action, action } from "easy-peasy";
import { DataModel } from "./Store";

export enum FlowMode {
    SELECT,
    CONNECT,
    DELETE,
    MOVE,
}


export type FlowStoreModel = {
    mode: FlowMode;
    /** Data being dragged from definition */
    dragging?: DataModel;
}

export type FlowActionsModel = {
    setMode: Action<FlowStoreModel, FlowMode>;
}

export const FlowActions: FlowActionsModel = {
    setMode: action((state, mode) => {
        state.mode = mode;
    })
}

/**
 * Notify flow that a job has been dragged to the canvas
 */
function droppedJob() {

}

/**
 * Update flow to reflect that job status
 */
function updatedJob() {

}

/**
 * Store to support data transfer between React Flow and DefinitionStore
 */
 const FlowStore: FlowStoreModel = {
    mode: FlowMode.SELECT,
};

export { FlowStore };
