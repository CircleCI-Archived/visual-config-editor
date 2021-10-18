import { createTypedHooks } from 'easy-peasy';
import { StoreActions, StoreModel } from './Store';

const typedHooks = createTypedHooks<StoreModel & StoreActions>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
