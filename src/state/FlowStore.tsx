import { Action, action } from "easy-peasy";

export enum FlowMode {
    SELECT,
    CONNECT,
    DELETE,
    MOVE,
}


export type FlowStoreModel = {
    mode: FlowMode;
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
