import {
  Config,
  parameters,
  workflow,
  Workflow,
} from '@circleci/circleci-config-sdk';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { WorkflowJobAbstract } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Action, action, ActionCreator, ThunkOn, thunkOn } from 'easy-peasy';
import { MutableRefObject } from 'react';
import {
  ElementId,
  Elements,
  FlowElement,
  SetConnectionId,
  XYPosition,
} from 'react-flow-renderer';
import { v4 } from 'uuid';
import { store } from '../App';
import { ConfirmationDialogue } from '../components/atoms/ConfirmationModal';
import DefinitionsMenu from '../components/menus/definitions/DefinitionsMenu';
import { OrbImportWithMeta } from '../components/menus/definitions/OrbDefinitionsMenu';
import { JobMapping } from '../mappings/components/JobMapping';
import {
  setWorkflowDefinition,
  WorkflowStage,
} from '../mappings/components/WorkflowMapping';
import InspectableMapping from '../mappings/InspectableMapping';
import {
  AllDefinitionActions,
  createDefinitionStore,
  definitionsAsArray,
  DefinitionsModel,
  DefinitionsStoreModel,
  DefinitionStore,
  DefinitionSubscriptions,
  DefinitionType,
  NamedGenerable,
} from './DefinitionStore';

export interface NavigationBack {
  distance?: number;
  applyValues?: (current: any) => any;
  applyObservers?: (current?: Array<DefinitionSubscriptions>) => any;
  toast?: ToastModel;
}

export interface ToastModel {
  label: string;
  content: string;
  status: 'success' | 'failed' | 'warning';
  timeout?: NodeJS.Timeout;
}

export interface ConfirmationModal {
  type: 'save' | 'delete';
  onConfirm: () => void;
}

export interface WorkflowModel {
  name: string;
  id: string;
  /*
   * the main thing being updated. every time we want to change an element in this array
   */
  elements: Elements<any>;
}

export interface PreviewToolboxModel {
  filter: {
    type: 'branches' | 'tags';
    pattern: string;
    preview: boolean;
  };
}

export interface DataModel {
  data?: any;
  dataType?: InspectableMapping;
}

export interface NavigationModel extends NavigationStop {
  jumpedFrom?: NavigationStop;
  from?: NavigationModel;
}

export interface NavigationComponent {
  Icon?: React.FunctionComponent<any>;
  Component: React.FunctionComponent<any>;
  Label: React.FunctionComponent<any>;
}
export interface NavigationStop {
  component: NavigationComponent;
  props: { [key: string]: any };
  origin?: boolean;
}

export interface StagedJobMap {
  workflows: {
    [workflow: string]: {
      [job: string]: number;
    };
  };
}

export type StoreModel = DefinitionsStoreModel & {
  /** Last generated configuration */
  config: string | undefined;
  /** The configuration with proposed changes */
  editingConfig: string | undefined;
  /** The current step of the guide */
  guideStep?: number;
  /** Node placeholder element info */
  placeholder?: { index: number; id: string };
  /** Map to staged workflow jobs, to save on time-space complexity */
  stagedJobs: StagedJobMap;
  /** Allows for tracking of components and their props in NavigationPanel */
  navigation: NavigationModel;
  /** Staged Job Preview Toolbox state  */
  previewToolbox: PreviewToolboxModel;

  toast?: ToastModel;
  confirm?: ConfirmationModal;

  /** Data being dragged from definition */
  dragging?: DataModel;
  altAction?: boolean;
  connecting?: {
    intent: 'creating' | 'deleting';
    start?: {
      ref?: MutableRefObject<any>;
      id: SetConnectionId;
      name?: string;
    };
    end?: {
      id: SetConnectionId;
      pos?: XYPosition;
      ref?: MutableRefObject<any>;
      name?: string;
    };
  };
  /** Currently selected workflow pane index */
  selectedWorkflow: string;
  errorMessage?: string;
};

export type UpdateDiff = {
  type: 'add' | 'remove' | 'update';
  value: UpdateType<NamedGenerable>;
};
export interface UpdateType<Out, In = Out> {
  old: Out;
  new: In;
  /**
   * Used by Workflows to update WorkflowJobs
   * Could be used to optimize subscriptions later.
   */
  diff?: UpdateDiff;
}

export type StoreActions = AllDefinitionActions & {
  persistProps: Action<StoreModel, { [key: string]: object }>;
  setDragging: Action<StoreModel, DataModel | undefined>;
  setConnecting: Action<
    StoreModel,
    {
      ref?: MutableRefObject<any>;
      id: SetConnectionId;
      name?: string;
    }
  >;
  setAltAction: Action<StoreModel, boolean>;
  updateConnecting: Action<
    StoreModel,
    | {
        ref?: MutableRefObject<any>;
        id: SetConnectionId;
        pos?: XYPosition;
        name?: string;
      }
    | undefined
  >;

  setGuideStep: Action<StoreModel, number | undefined>;

  navigateTo: Action<StoreModel, NavigationStop & { values?: any }>;
  navigateBack: Action<StoreModel, NavigationBack | void>;
  onNavigate: ThunkOn<StoreActions, NavigationBack | void>;

  selectWorkflow: Action<StoreModel, string>;
  addWorkflowElement: Action<StoreModel, FlowElement<any>>;
  removeWorkflowElement: Action<StoreModel, string>;
  updateWorkflowElement: Action<StoreModel, { id: string; data: any }>;
  setWorkflowElements: Action<StoreModel, Elements<any>>;

  importOrb: Action<StoreModel, OrbImportWithMeta>;
  unimportOrb: Action<StoreModel, OrbImportWithMeta>;

  loadConfig: Action<StoreModel, Config | Error>;
  loadDefinitions: ThunkOn<StoreActions, Config | Error>;
  generateConfig: Action<StoreModel, void | Partial<DefinitionsModel>>;
  error: Action<StoreModel, any>;

  updatePreviewToolBox: Action<StoreModel, PreviewToolboxModel>;
  setToast: Action<StoreModel, ToastModel | undefined | void>;
  updateConfirmation: Action<StoreModel, ConfirmationModal | undefined>;
};

const Actions: StoreActions = {
  ...createDefinitionStore(),
  persistProps: action((state, payload) => {
    state.navigation = { ...state.navigation, props: payload };
  }),
  setAltAction: action((state, payload) => {
    state.altAction = payload;
  }),
  setConnecting: action((state, payload) => {
    if (payload.ref) {
      state.connecting = {
        intent: state.altAction ? 'deleting' : 'creating',
        start: payload,
      };
    } else {
      state.connecting = undefined;
    }
  }),
  updateConnecting: action((state, payload) => {
    if (state.connecting?.start) {
      state.connecting = {
        ...state.connecting,
        end: payload,
      };
    }
  }),

  setGuideStep: action((state, payload) => {
    state.guideStep = payload;
  }),

  /** TODO: Refactor with context
   * https://reactjs.org/docs/hooks-reference.html#usecontext
   */
  navigateTo: action((state, payload) => {
    const curNav = state.navigation;

    if (curNav.jumpedFrom) {
      state.navigation.jumpedFrom = undefined;
    }

    let root = curNav.from;

    while (root?.from !== undefined) {
      root = root.from;
    }

    state.navigation = {
      ...payload,
      from:
        payload.origin && root
          ? root
          : {
              ...curNav,
              props: {
                ...curNav.props,
                values: payload.values,
              },
            },
    };
  }),

  navigateBack: action((state, payload) => {
    const distance = payload?.distance || 1;

    if (state.navigation.from) {
      let travelTo = state.navigation;

      for (let i = 0; i < distance; i++) {
        if (travelTo.from) {
          travelTo = travelTo.from;
        } else {
          throw new Error('Tried to navigate back to an undefined component!');
        }
      }

      const values =
        payload?.applyValues?.(travelTo.props.values) || travelTo.props.values;

      let props;

      /**
       * Solution for modifying props on sub menus.
       */
      if (travelTo.props?.menuProps) {
        props = {
          ...travelTo.props,
          menuProps: {
            ...travelTo.props.menuProps,
            values: values,
          },
        };
      } else {
        props = {
          ...travelTo.props,
          values: values,
        };
      }

      state.navigation = {
        ...travelTo,
        props: props,
        jumpedFrom: distance > 1 ? state.navigation : undefined,
      };
    } else {
      state.navigation = { component: DefinitionsMenu, props: {} };
    }
  }),

  onNavigate: thunkOn(
    (actions) => actions.navigateBack,
    (actions, thunk) => {
      const state = store.getState();
      const incomingToast = thunk.payload?.toast;
      const currentToast = state.toast;

      if (incomingToast) {
        if (currentToast && currentToast.timeout) {
          clearTimeout(currentToast.timeout);
        }

        const timeout = setTimeout(() => {
          actions.setToast();
        }, 3500);

        actions.setToast({ ...incomingToast, timeout });
      }
    },
  ),

  setDragging: action((state, payload) => {
    state.dragging = payload;
  }),

  selectWorkflow: action((state, index) => {
    state.selectedWorkflow = index;
  }),

  addWorkflowElement: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflow];
    const workflow = workflowDef.value;

    if (payload.type === 'jobs') {
      const jobData = payload.data as WorkflowJobAbstract;
      const jobName = jobData.name;
      const stagedJobs = state.stagedJobs.workflows;
      let curWorkflow = stagedJobs[workflow.name];

      if (workflow.name in state.stagedJobs.workflows) {
        if (!curWorkflow[jobName]) {
          curWorkflow[jobName] = 1;
        } else {
          curWorkflow[jobName]++;
        }
      } else {
        stagedJobs[workflow.name] = { [jobName]: 1 };
      }

      state.stagedJobs = { workflows: stagedJobs };
    }

    setWorkflowDefinition(state, workflow.name, {
      ...workflowDef,
      value: new WorkflowStage(
        workflow.name,
        workflow.id,
        workflow.jobs,
        workflow.when,
        [...workflow.elements, payload],
      ),
    });

    workflow.elements.push(payload);
  }),
  removeWorkflowElement: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflow];
    const workflow = workflowDef.value;
    const map = state.stagedJobs;
    const stagedJob = map.workflows[workflow.name];

    const elements = workflow.elements.filter((element) => {
      const filtered = element.id === payload;

      if (filtered) {
        if (element.type === 'jobs') {
          const workflowJob = element.data as WorkflowJobAbstract;
          const name = workflowJob.name;
          const sameSourceJobs = stagedJob[name];

          if (sameSourceJobs) {
            stagedJob[name]--;

            if (stagedJob[name] === 0) {
              delete stagedJob[name];
            }

            state.stagedJobs = { workflows: map.workflows };
          }
        }
      }

      // TODO: determine if there are any more of the same job type in the workflow.
      // Requires name duplication to be fully logical
      return !filtered;
    });

    setWorkflowDefinition(state, workflow.name, {
      ...workflowDef,
      value: new WorkflowStage(
        workflow.name,
        workflow.id,
        workflow.jobs,
        workflow.when,
        elements,
      ),
    });
  }),
  setWorkflowElements: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflow];
    const workflow = workflowDef.value;

    setWorkflowDefinition(state, workflow.name, {
      ...workflowDef,

      value: new WorkflowStage(
        workflow.name,
        workflow.id,
        workflow.jobs,
        workflow.when,
        payload,
      ),
    });
  }),
  updateWorkflowElement: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflow];
    const workflow = workflowDef.value;

    setWorkflowDefinition(state, workflow.name, {
      ...workflowDef,

      value: new WorkflowStage(
        workflow.name,
        workflow.id,
        workflow.jobs,
        workflow.when,
        workflow.elements.map((e) =>
          e.id === payload.id ? { ...e, data: payload.data } : e,
        ),
      ),
    });
  }),

  importOrb: action((state, payload) => {
    const orb = state.definitions.orbs[payload.name];
    if (!orb) {
      state.definitions.orbs = {
        ...state.definitions.orbs,
        [payload.name]: { observers: {}, value: payload },
      };
    }
  }),

  unimportOrb: action((state, payload) => {
    // state.definitions.orbs = state.definitions.orbs.filter(
    //   (orb) => orb.name !== payload.name && orb.namespace !== payload.namespace,
    // );
  }),

  error: action((state, payload) => {
    console.error('An action was not found! ', payload);
  }),

  loadDefinitions: thunkOn(
    (actions) => actions.loadConfig,
    async (actions, target) => {
      const config = target.payload;

      if (config instanceof Error) {
        return;
      }

      const { parameters: parameterList, ...rest } = config;
      const defineAction = (type: DefinitionType) =>
        actions[`define_${type}`] as unknown as ActionCreator<NamedGenerable>;

      const defineParameter = defineAction('parameters');

      parameterList?.parameters.forEach(defineParameter);

      type NonParameterType = Exclude<DefinitionType, 'parameters'>;

      ['commands', 'executors', 'jobs'].forEach((type) => {
        const gens: NamedGenerable[] | undefined =
          rest[type as NonParameterType];
        gens?.forEach((g) => {
          const define = defineAction(type as NonParameterType);
          define(g);
        });
      });
    },
  ),

  loadConfig: action((state, payload) => {
    if (payload instanceof Error) {
      state.errorMessage = payload.message;

      console.error(payload);
      return;
    }

    const nodeWidth = 250; // Make this dynamic
    const nodeHeight = 60; // Make this dynamic

    const getJobName = (workflowJob: workflow.WorkflowJobAbstract) => {
      const baseName =
        workflowJob instanceof workflow.WorkflowJob
          ? workflowJob.job.name
          : (workflowJob as workflow.WorkflowJobApproval).name;

      return workflowJob.parameters?.name || baseName;
    };

    const workflowJobCounts: Record<string, Record<string, number>> = {};
    const workflows = Object.assign(
      {},
      ...payload.workflows.map((flow) => {
        const sourceJobCounts: Record<string, number> = {};
        const jobTable: Record<string, workflow.WorkflowJobAbstract> = {};
        const requiredJobs: Record<string, boolean> = {};

        flow.jobs.forEach((workflowJob) => {
          const jobName = getJobName(workflowJob);
          jobTable[jobName] = workflowJob;

          if (workflowJob instanceof workflow.WorkflowJob) {
            const sourceJobName = workflowJob.job.name;

            if (sourceJobCounts[sourceJobName] > 0) {
              sourceJobCounts[sourceJobName]++;
            } else {
              sourceJobCounts[sourceJobName] = 1;
            }
          }

          workflowJob.parameters?.requires?.forEach((requiredJob) => {
            requiredJobs[requiredJob] = true;
          });
        });

        workflowJobCounts[flow.name] = sourceJobCounts;

        // Filter down to jobs that are not required by other jobs
        const endJobs = flow.jobs.filter(
          (workflowJob) => !(getJobName(workflowJob) in requiredJobs),
        );

        type JobNodeProps = { col: number; row: number };
        const elements: Elements = [];
        const columns: Array<number> = [];
        const solved: Record<ElementId, JobNodeProps> = {};

        const solve = (workflowJob: workflow.WorkflowJobAbstract) => {
          const jobName = getJobName(workflowJob);

          if (solved[jobName] !== undefined) {
            return solved[jobName];
          }

          const props: JobNodeProps = { col: 0, row: 0 };

          if (workflowJob.parameters?.requires) {
            let greatestColumn = 0;
            let greatestRow = 0;

            workflowJob.parameters.requires.forEach((requiredJob) => {
              let requiredJobProps;

              if (solved[requiredJob] === undefined) {
                requiredJobProps = solve(jobTable[requiredJob]);
              } else {
                requiredJobProps = solved[requiredJob];
              }

              greatestRow = Math.max(greatestRow, requiredJobProps.row);
              greatestColumn = Math.max(greatestColumn, requiredJobProps.col);

              // add connection line
              elements.push({
                id: v4(),
                source: requiredJob,
                target: jobName,
                type: 'requires',
                sourceHandle: `${requiredJob}_source`,
                targetHandle: `${jobName}_target`,
                animated: false,
                style: { stroke: '#A3A3A3', strokeWidth: '2px' },
              });
            });

            props.col = greatestColumn + 1;
            props.row = greatestRow;
          }

          if (columns.length > props.col) {
            columns[props.col]++;
          } else {
            columns.push(1);
          }

          // assign job to most recent requirement
          props.row = Math.max(columns[props.col], props.row);

          // add job node
          elements.push({
            id: jobName,
            data: workflowJob,
            connectable: true,
            dragHandle: '.node',
            type: 'jobs',
            position: { x: props.col * nodeWidth, y: props.row * nodeHeight },
          });

          solved[jobName] = props;

          return props;
        };

        // Build workflow and prep requirement connection generation
        endJobs.forEach((workflowJob) => {
          solve(workflowJob);
        });

        return {
          [flow.name]: {
            value: new WorkflowStage(
              flow.name,
              v4(),
              flow.jobs,
              flow.when,
              elements,
            ),
          },
        };
      }),
    );

    state.definitions = {
      ...state.definitions,
      workflows,
    };
    state.selectedWorkflow = Object.keys(workflows)[0];
    state.stagedJobs = { workflows: workflowJobCounts };
    state.config = payload.generate();
  }),
  generateConfig: action((state, payload) => {
    const stages = Object.values(state.definitions.workflows);
    const workflows = stages.map((stage) => {
      const jobs = stage.value.elements
        .filter((element) => element.type === JobMapping.key)
        .map((element) => element.data);

      return new Workflow(stage.value.name, jobs);
    });

    const defs = state.definitions;
    // This is a merged config preview. TODO: Refactor merging process.
    const merge = (cur: any, update: any) =>
      update ? [...cur, ...update] : cur;

    const toArray = (defs: Partial<DefinitionsModel>) =>
      Object.assign(
        {},
        ...Object.entries(defs).map(([type, defRecord]) => ({
          [type]: definitionsAsArray<NamedGenerable>(defRecord),
        })),
      );

    const defArrays = toArray(defs);
    const payloadArrays = payload ? toArray(payload) : undefined;

    const pipelineParameters: parameters.CustomParameter<PipelineParameterLiteral>[] =
      merge(defArrays.parameters, defArrays?.parameters);

    const parameterList =
      pipelineParameters.length > 0
        ? new parameters.CustomParametersList<PipelineParameterLiteral>(
            pipelineParameters,
          )
        : undefined;

    const config = new Config(
      false,
      merge(defArrays.jobs, payloadArrays?.jobs),
      workflows,
      merge(defArrays.executors, payloadArrays?.executors),
      merge(defArrays.commands, payloadArrays?.commands),
      parameterList,
      merge(defArrays.orbs, payloadArrays?.orbs),
    );

    if (payload) {
      state.editingConfig = config.generate();
    } else {
      state.config = config.generate();
      state.editingConfig = undefined;
    }
  }),

  updatePreviewToolBox: action((state, payload) => {
    state.previewToolbox = payload;
  }),
  setToast: action((state, payload) => {
    state.toast = payload ?? undefined;
  }),
  updateConfirmation: action((state, payload) => {
    state.confirm = payload;
  }),
};

const Store: StoreModel & StoreActions = {
  selectedWorkflow: 'build-and-deploy',
  editingConfig: undefined,
  config: undefined,
  guideStep: 1,
  navigation: {
    component: DefinitionsMenu,
    props: { expanded: [true, true, false, false] },
  },
  previewToolbox: {
    filter: {
      type: 'branches',
      pattern: '',
      preview: false,
    },
  },
  ...DefinitionStore,
  stagedJobs: {
    workflows: {
      'build-and-deploy': {},
    },
  },
  // workflows: [
  //   {
  //     name: 'build-and-test',
  //     elements: [],
  //     id: v4(),
  //   },
  // ],
  ...Actions,
};

export default Store;
