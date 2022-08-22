import {
  Config,
  Job,
  parameters,
  workflow,
} from '@circleci/circleci-config-sdk';
import { PipelineParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { WorkflowJobAbstract } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { OrbImportManifest } from '@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types';
import { Action, action, ActionCreator, ThunkOn, thunkOn } from 'easy-peasy';
import { MutableRefObject, RefObject } from 'react';
import {
  Connection,
  ElementId,
  Elements,
  FlowElement,
  SetConnectionId,
  XYPosition,
} from 'react-flow-renderer';
import { v4 } from 'uuid';
import { searchClient, store } from '../App';
import { ConfirmationModalModel } from '../components/containers/ConfirmationModal';
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
  generateLifeCycleMatrix,
  NamedGenerable,
} from './DefinitionStore';

export interface NavigationBack {
  distance?: number;
  /**
   * Apply
   */
  applyValues?: (current: any) => any;
}

export interface ToastModel {
  label: string;
  content: string;
  link?: { url: string; label: string };
  duration?: number;
  status: 'success' | 'failed' | 'warning';
  timeout?: NodeJS.Timeout;
}

export type WithToast<T> = T & { toast?: ToastModel };

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

export interface InfoToolTip {
  description: string;
  ref: RefObject<any>;
  facing?: 'top' | 'bottom' | 'left' | 'right';
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
  confirm?: ConfirmationModalModel;
  tooltip?: InfoToolTip;

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
  selectedWorkflowId: string;
  errorMessage?: string;
};

export type UpdateDiff = {
  type: 'add' | 'remove' | 'update';
  value: UpdateType<NamedGenerable>;
};
export interface UpdateType<Out, In = Out> {
  old: Out;
  new: In;
  observers?: DefinitionSubscriptions;
  res?: (value: unknown) => void;
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
  navigateBack: Action<StoreModel, WithToast<NavigationBack> | void>;
  onToastEvent: ThunkOn<StoreActions, WithToast<any> | ToastModel | void>;

  selectWorkflow: Action<StoreModel, string>;
  addWorkflowElement: Action<StoreModel, FlowElement<any>>;
  removeWorkflowElement: Action<StoreModel, string>;
  updateWorkflowElement: Action<StoreModel, { id: string; data: any }>;
  setWorkflowElements: Action<StoreModel, Elements<any>>;
  observeWorkflowSources: ThunkOn<StoreActions, UpdateType<Job>>;

  importOrb: Action<StoreModel, OrbImportWithMeta>;
  unimportOrb: Action<StoreModel, OrbImportWithMeta>;

  loadConfig: Action<
    StoreModel,
    { config: Config; manifests?: Record<string, OrbImportManifest> } | Error
  >;
  loadDefinitions: ThunkOn<StoreActions, Config | Error>;
  generateConfig: Action<StoreModel, void | Partial<DefinitionsModel>>;
  error: Action<StoreModel, any>;

  updatePreviewToolBox: Action<StoreModel, PreviewToolboxModel>;
  setToast: Action<StoreModel, ToastModel | undefined | void>;
  triggerToast: Action<StoreModel, ToastModel | undefined | void>;
  triggerConfirmation: Action<StoreModel, ConfirmationModalModel | undefined>;
  triggerConfigRefresh: ThunkOn<StoreActions, void>;

  updateTooltip: Action<StoreModel, InfoToolTip | undefined>;
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

  onToastEvent: thunkOn(
    (actions) => [actions.navigateBack, actions.triggerToast],
    (actions, thunk) => {
      const state = store.getState();
      const incomingToast = ((thunk.payload &&
        (thunk.payload as unknown as WithToast<any>).toast) ??
        thunk.payload) as ToastModel;
      const currentToast = state.toast;

      if (incomingToast?.content) {
        if (currentToast && currentToast.timeout) {
          clearTimeout(currentToast.timeout);
        }

        const timeout = setTimeout(() => {
          actions.setToast();
        }, incomingToast.duration || 3500);

        actions.setToast({ ...incomingToast, timeout });
      }
    },
  ),

  setDragging: action((state, payload) => {
    state.dragging = payload;
  }),

  selectWorkflow: action((state, index) => {
    state.selectedWorkflowId = index;
  }),

  addWorkflowElement: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflowId];
    const wf = workflowDef.value;
    let jobs = wf.jobs;

    if (payload.type === 'jobs') {
      const jobData = payload.data as WorkflowJobAbstract;
      const jobName = jobData.name;
      const stagedJobs = state.stagedJobs.workflows;
      let curWorkflow = stagedJobs[wf.name];

      if (wf.name in state.stagedJobs.workflows) {
        if (!curWorkflow[jobName]) {
          curWorkflow[jobName] = 1;
        } else {
          curWorkflow[jobName]++;
        }
      } else {
        stagedJobs[wf.name] = { [jobName]: 1 };
      }

      jobs = jobs.concat(jobData);

      state.stagedJobs = { workflows: stagedJobs };
    }

    setWorkflowDefinition(state, wf.name, {
      ...workflowDef,
      value: new WorkflowStage(wf.name, wf.id, jobs, wf.when, [
        ...wf.elements,
        payload,
      ]),
    });

    wf.elements.push(payload);
  }),
  removeWorkflowElement: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflowId];
    const wf = workflowDef.value;
    const map = state.stagedJobs;
    const stagedJob = map.workflows[wf.name];
    let jobs = wf.jobs;

    const elements = wf.elements.filter((element) => {
      if (element.type === 'requires') {
        const connection = element as Connection;

        if (connection.source === payload || connection.target === payload) {
          return false;
        }
      }

      if (element.type === 'jobs' && element.id === payload) {
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

        jobs = jobs.filter(
          (job) =>
            !(job instanceof workflow.WorkflowJob) || job.job.name !== payload,
        );
      }

      return element.id !== payload;
    });

    setWorkflowDefinition(state, wf.name, {
      ...workflowDef,
      value: new WorkflowStage(wf.name, wf.id, jobs, wf.when, elements),
    });
  }),
  setWorkflowElements: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflowId];
    const workflow = workflowDef.value;
    const jobs = payload
      .filter((element) => element.type === JobMapping.key)
      .map((element) => element.data);

    setWorkflowDefinition(state, workflow.name, {
      ...workflowDef,

      value: new WorkflowStage(
        workflow.name,
        workflow.id,
        jobs,
        workflow.when,
        payload,
      ),
    });
  }),
  // TODO: refactor and handle by DefinitionStore
  updateWorkflowElement: action((state, payload) => {
    const workflowDef = state.definitions.workflows[state.selectedWorkflowId];
    const wf = workflowDef.value;
    const newName = payload.data.parameters?.name || payload.data.name;
    const changedName = newName !== payload.data.name;

    const elements = wf.elements.map((element) => {
      if (element.id === payload.id) {
        return {
          ...element,
          ...payload,
          id: newName,
        };
      } else if (element.type === 'requires' && changedName) {
        const connection = element as Connection;

        if (connection.source === payload.id) {
          return {
            ...element,
            source: newName,
            sourceHandle: `${newName}_source`,
          };
        } else if (connection.target === payload.id) {
          return {
            ...element,
            target: newName,
            targetHandle: `${newName}_target`,
          };
        }
      }

      return element;
    });

    // TODO: optimize this
    const jobs = wf.jobs.map((staged) => {
      if (staged.name === payload.id) {
        return payload.data;
      }

      if (staged.parameters?.requires && changedName) {
        const requires = staged.parameters.requires.map((req) => {
          if (req === payload.id) {
            return newName;
          } else {
            return req;
          }
        });

        if (staged instanceof workflow.WorkflowJob) {
          return new workflow.WorkflowJob(staged.job, {
            ...staged.parameters,
            requires,
          });
        }

        return new workflow.WorkflowJobApproval(staged.name, {
          ...staged.parameters,
          requires,
        });
      }

      return staged;
    });

    setWorkflowDefinition(state, wf.name, {
      ...workflowDef,

      value: new WorkflowStage(wf.name, wf.id, jobs, wf.when, elements),
    });
  }),
  observeWorkflowSources: thunkOn(
    (actions) => actions.update_jobs,
    (actions, thunk) => {
      const state = store.getState();
      const payload = thunk.payload;

      Object.values(state.definitions.workflows).forEach((workflowDef) => {
        const wf = workflowDef.value;
        const change = payload as unknown as UpdateType<Job>;
        const oldName = change.old.name;
        const newName = change.new.name;
        const changedName = oldName !== newName;

        const elements = wf.elements.map((element) => {
          if (element.type === 'jobs' && element.data.job.name === oldName) {
            const wfJob = element.data as workflow.WorkflowJob;

            return {
              ...element,
              data: new workflow.WorkflowJob(
                change.new,
                wfJob.parameters,
                wfJob.pre_steps,
                wfJob.post_steps,
              ),
              id: newName,
            };
          } else if (element.type === 'requires' && changedName) {
            const connection = element as Connection;

            if (connection.source === oldName) {
              return {
                ...element,
                source: newName,
                sourceHandle: `${newName}_source`,
              };
            } else if (connection.target === oldName) {
              return {
                ...element,
                target: newName,
                targetHandle: `${newName}_target`,
              };
            }
          }

          return element;
        });

        // TODO: optimize this
        const jobs = wf.jobs.map((staged) => {
          if (
            staged.name === oldName &&
            staged instanceof workflow.WorkflowJob
          ) {
            return new workflow.WorkflowJob(
              change.new,
              staged.parameters,
              staged.pre_steps,
              staged.post_steps,
            );
          }

          if (staged.parameters?.requires && changedName) {
            const requires = staged.parameters.requires.map((req) => {
              if (req === oldName) {
                return newName;
              } else {
                return req;
              }
            });

            if (staged instanceof workflow.WorkflowJob) {
              return new workflow.WorkflowJob(
                staged.job,
                {
                  ...staged.parameters,
                  requires,
                },
                staged.pre_steps,
                staged.post_steps,
              );
            }

            return new workflow.WorkflowJobApproval(staged.name, {
              ...staged.parameters,
              requires,
            });
          }

          return staged;
        });

        actions.update_workflows({
          old: wf,
          new: new WorkflowStage(wf.name, wf.id, jobs, wf.when, elements),
        });
      });
    },
  ),
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
    state.definitions.orbs = { ...state.definitions.orbs };
    delete state.definitions.orbs[payload.alias];
  }),

  error: action((state, payload) => {
    console.error('An action was not found! ', payload);
  }),

  loadDefinitions: thunkOn(
    (actions) => actions.loadConfig,
    async (actions, target) => {
      if (target.payload instanceof Error) {
        actions.triggerToast({
          label: 'Config',
          content: 'failed to load.',
          link: {
            label: 'Report an issue.',
            url: 'https://github.com/CircleCI-Public/visual-config-editor/issues',
          },
          duration: 25000,
          status: 'failed',
        });
        return;
      }

      const config = target.payload.config;
      const manifests = target.payload.manifests;
      const { parameters: parameterList, orbs, ...rest } = config;
      const defineAction = (type: DefinitionType) =>
        actions[`define_${type}`] as unknown as ActionCreator<NamedGenerable>;

      const defineParameter = defineAction('parameters');

      parameterList?.parameters.forEach(defineParameter);

      if (orbs) {
        Object.values(orbs).forEach(async (orb) => {
          const manifest = manifests ? manifests[orb.alias] : undefined;

          if (!manifest) {
            console.warn(`Orb ${orb.alias} is not defined in the manifests.`);
            return;
          }

          const agindex = searchClient.initIndex('orbs-prod');
          const agdata = await agindex.findObject<{
            logo_url: string;
            url: string;
          }>((hit) => hit.objectID === `${orb.namespace}/${orb.name}`);
          actions.importOrb(
            new OrbImportWithMeta(
              orb.alias,
              orb.namespace,
              orb.name,
              manifest,
              orb.version,
              agdata.object.logo_url,
              `${agdata.object.url}?version=${orb.version}`,
              orb.description,
              orb.display,
            ),
          );
        });
      }

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

    const config = payload.config;
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
      ...config.workflows.map((flow) => {
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
    state.selectedWorkflowId = Object.keys(workflows)[0];
    state.stagedJobs = { workflows: workflowJobCounts };
    state.config = config.generate();
  }),
  generateConfig: action((state, payload) => {
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
      merge(defArrays.workflows, payloadArrays?.workflows),
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
  // this is just to trigger the set toast action
  triggerToast: action(() => {}),
  triggerConfirmation: action((state, payload) => {
    state.confirm = payload;
  }),
  triggerConfigRefresh: thunkOn(
    (actions) => [
      actions.importOrb,
      actions.unimportOrb,
      actions.addWorkflowElement,
      actions.setWorkflowElements,
      actions.removeWorkflowElement,
      actions.updateWorkflowElement,
      ...generateLifeCycleMatrix(actions),
    ],
    (actions) => {
      actions.generateConfig();
    },
  ),
  updateTooltip: action((state, payload) => {
    state.tooltip = payload;
  }),
};

const Store: StoreModel & StoreActions = {
  selectedWorkflowId: 'build-and-deploy',
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
  ...Actions,
};

export default Store;
