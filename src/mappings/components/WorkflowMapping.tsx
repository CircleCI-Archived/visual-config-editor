import { Job, workflow, Workflow } from '@circleci/circleci-config-sdk';
import { When } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Logic';
import { WorkflowJobAbstract } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Edge, Node } from 'react-flow-renderer';
import { Definition, DefinitionAction } from '../../state/DefinitionStore';
import { StoreModel } from '../../state/Store';
import GenerableMapping from '../GenerableMapping';

export type WorkflowElements = { nodes: Node[], edges: Edge[]};
export class WorkflowStage extends Workflow {
  elements: WorkflowElements;
  id: string;

  constructor(
    name: string,
    id: string,
    jobs?: Array<Job | WorkflowJobAbstract>,
    when?: When,
    elements: WorkflowElements = { nodes: [], edges: []},
  ) {
    super(name, jobs, when);

    this.elements = elements;
    this.id = id;
  }
}

/**
 * Helper function to set the definition of a workflow
 */
export const setWorkflowDefinition = (
  state: StoreModel,
  name: string,
  workflow: Definition<WorkflowStage>,
) => {
  state.definitions = {
    ...state.definitions,
    workflows: {
      ...state.definitions.workflows,
      [name]: workflow,
    },
  };
};

export const WorkflowMapping: GenerableMapping<WorkflowStage> = {
  key: 'workflows',
  store: {
    add: (actions) => actions.define_workflows,
    update: (actions) => actions.update_workflows,
    remove: (actions) => actions.delete_workflows,
  },
  storeHooks: {
    update: (state, values) => {
      /**
       * Handles the non-observable state of the workflow
       */
      if (values.old.name !== values.new.name) {
        if (state.selectedWorkflowId === values.old.name) {
          state.selectedWorkflowId = values.new.name;
        }

        state.stagedJobs.workflows[values.new.name] =
          state.stagedJobs.workflows[values.old.name];
      }

      return values.new;
    },
  },
  subscriptions: {
    jobs: (prev: Job, cur: Job, w) => {
      const updates: Record<string, workflow.WorkflowJob> = {};
      const jobs = w.jobs.map((job) => {
        if (job instanceof workflow.WorkflowJob && job.name === prev.name) {
          const stagedJob = new workflow.WorkflowJob(cur, job.parameters);

          updates[job.parameters?.name || job.name] = stagedJob;

          return stagedJob;
        }
        return job;
      });

      const nodes = w.elements.nodes.map((node) => {
        return node.type === 'jobs' && node.data.job.name === prev.name
          ? {
              ...node,
              data: updates[node.data.parameters.name || node.data.job.name],
            }
          : node;
      });

      return new WorkflowStage(w.name, w.id, jobs, w.when, { nodes: nodes, edges: w.elements.edges});
    },
  },
  resolveObservables: (w) => ({
    jobs: w.jobs.filter((job) => {
      return job instanceof workflow.WorkflowJob;
    }),
  }),
};

export type WorkflowAction = DefinitionAction<WorkflowStage>;

export type WorkflowActions = {
  define_workflows: WorkflowAction;
  update_workflows: WorkflowAction;
  delete_workflows: WorkflowAction;
  cleanup_workflows: WorkflowAction;
};
