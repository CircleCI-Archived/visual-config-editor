import { Job, types, workflow } from '@circleci/circleci-config-sdk';
import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import React, { useRef } from 'react';
import { Handle, isNode, NodeProps, Position } from 'react-flow-renderer';
import JobIcon from '../../../icons/components/JobIcon';
import JobOnHoldIcon from '../../../icons/components/JobOnHoldIcon';
import DeleteItemIcon from '../../../icons/ui/DeleteItemIcon';
import MinusIcon from '../../../icons/ui/MinusIcon';
import PlusIcon from '../../../icons/ui/PlusIcon';
import { JobMapping } from '../../../mappings/components/JobMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { StagedJobMenuNav } from '../../menus/stage/StagedJobMenu';
import { flattenGenerable } from '../Definition';

const ConnectorIcon = (props: { filled: boolean; subtraction?: boolean }) => {
  return (
    <>
      {props.subtraction ? (
        <MinusIcon
          filled={props.filled}
          color="rgb(150, 0, 8)"
          className="bg-white rounded-full w-full border border-white"
        />
      ) : (
        <PlusIcon
          filled={props.filled}
          color="rgb(0, 120, 202)"
          className="bg-white rounded-full w-full border border-white"
        />
      )}
    </>
  );
};

const JobNode: React.FunctionComponent<
  NodeProps & { data: workflow.WorkflowJob }
> = (props) => {
  const elements = useStoreState(
    (state) =>
      state.definitions.workflows[state.selectedWorkflow].value.elements,
  );
  const dragging = useStoreState((state) => state.dragging);
  // const setWorkflowElements = useStoreActions(
  //   (actions) => actions.setWorkflowElements,
  // );
  const updateJob = useStoreActions((actions) => actions.update_jobs);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const setConnecting = useStoreActions((actions) => actions.setConnecting);
  const toolbox = useStoreState((state) => state.previewToolbox);
  const altAction = useStoreState((state) => state.altAction);
  const removeWorkflowElement = useStoreActions(
    (actions) => actions.removeWorkflowElement,
  );

  const connecting = useStoreState((state) => state.connecting);
  const updateConnecting = useStoreActions(
    (actions) => actions.updateConnecting,
  );

  const updateWorkflowJob = (
    workflowJob: workflow.WorkflowJob,
    applyToData: {
      job?: Job;
      parameters?: types.workflow.WorkflowJobParameters;
    },
  ) =>
    elements.map((element) =>
      isNode(element) && element.data.job.name === workflowJob.job.name
        ? { ...element, data: { ...workflowJob, ...applyToData } }
        : element,
    );
  const [hovering, setHovering] = React.useState({
    handles: false,
    node: false,
    requiredBy: false,
    remove: false,
    requires: false,
  });

  let filtered = false;

  const workflowJob = props.data as WorkflowJob;
  const filters = workflowJob.parameters?.filters;

  if (filters && toolbox.filter.preview && filters[toolbox.filter.type]) {
    const jobFilter = filters[toolbox.filter.type];
    const pattern = toolbox.filter.pattern;
    const ignoreFilter = jobFilter?.ignore?.includes(pattern);
    const onlyFilter = jobFilter?.only?.includes(pattern);

    filtered = ignoreFilter || !onlyFilter;
  }

  const jobIcon = (isApproval: boolean = false) => {
    const classNameValue = 'w-5 mr-2';
    if (isApproval) {
      return <JobOnHoldIcon className={classNameValue} />;
    } else {
      return <JobIcon className={classNameValue} />;
    }
  };

  const viewJobProperties = () => {
    navigateTo({
      component: StagedJobMenuNav,
      props: {
        source: workflowJob.job,
        values: flattenGenerable(workflowJob, true),
        id: props.id,
      },
      origin: true,
    });
  };

  const trackHovering = (
    entering: string[],
    leaving: string[],
    postEnter?: () => void,
    postLeave?: () => void,
  ) => {
    return {
      onMouseEnter: () => {
        setHovering(
          entering.reduce(
            (previous, n) => ({ ...previous, [n]: true }),
            hovering,
          ),
        );
        postEnter && postEnter();
      },
      onMouseLeave: () => {
        setHovering(
          leaving.reduce(
            (previous, n) => ({ ...previous, [n]: false }),
            hovering,
          ),
        );
        postLeave && postLeave();
      },
    };
  };

  const nodeRef = useRef(null);
  const startConnecting =
    (side: 'source' | 'target') => (e: React.DragEvent<HTMLButtonElement>) => {
      setConnecting({
        ref: nodeRef,
        id: {
          connectionNodeId: props.id,
          connectionHandleType: side,
          connectionHandleId: `${props.id}_${side}`,
        },
        name: props.data.parameters?.name || props.data.name,
      });
      e.preventDefault();
    };

  return (
    <div
      className={`p-8 flex flex-row cursor-default`}
      {...trackHovering(
        ['handles'],
        ['handles', 'node', 'requires', 'requiredBy'],
        () => {
          const startType = connecting?.start?.id.connectionHandleType;
          const side = startType === 'source' ? 'target' : 'source';
          updateConnecting({
            ref: nodeRef,
            id: {
              connectionNodeId: props.id,
              connectionHandleType: side,
              connectionHandleId: `${props.id}_${side}`,
            },
            name: props.data.parameters?.name || props.data.name,
          });
        },
        () => {
          updateConnecting(undefined);
        },
      )}
      onDragOver={(e) => {
        if (dragging && dragging.dataType?.dragTarget === JobMapping.type) {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        if (
          dragging &&
          dragging.dataType?.dragTarget === JobMapping.type &&
          dragging.dataType.applyToNode
        ) {
          const applyToData = dragging.dataType.applyToNode(
            dragging.data,
            props.data,
          );

          if (JobMapping.type in applyToData) {
            updateJob({ old: props.data.job, new: applyToData.job });
          }

          if ('parameters' in applyToData) {
            updateWorkflowJob(props.data, applyToData);
          }
        }
      }}
    >
      <button
        className={`opacity-${
          hovering['handles'] && !hovering['node'] && !connecting?.start
            ? 100
            : 0
        } transition-opacity duration-300 w-4 h-4 my-auto mr-5`}
        id={`${props.id}_source`}
        {...trackHovering(['requires', 'handles'], ['requires'])}
        draggable
        onDragStart={startConnecting('target')}
      >
        <ConnectorIcon filled={hovering['requires']} subtraction={altAction} />
      </button>

      <div
        className={`p-2 bg-white node flex flex-row text-black rounded-md border cursor-pointer ${
          filtered ? 'bg-gray-200 opacity-60' : 'opacity-100'
        }
        ${
          (hovering['node'] && !hovering['remove']) ||
          (hovering['handles'] && connecting?.start)
            ? 'border-circle-blue'
            : 'border-circle-gray-300'
        }`}
        ref={nodeRef}
        {...trackHovering(['node'], ['node'])}
      >
        <button className="flex w-full" onClick={viewJobProperties}>
          {jobIcon(props.data.parameters?.type === 'approval')}
          {props.data.parameters?.name || props.data.name}
        </button>
        <button
          className={`my-auto
          opacity-${hovering['node'] ? 100 : 0}
          transition-opacity duration-150 w-8 h-full flex`}
          {...trackHovering(['remove'], ['remove'])}
          onClick={() => {
            removeWorkflowElement(props.id);
          }}
        >
          <DeleteItemIcon
            className="w-3 cursor-pointer m-auto"
            color={hovering['remove'] ? 'red' : '#AAAAAA'}
          />
        </button>
      </div>

      <button
        className={`opacity-${
          hovering['handles'] && !hovering['node'] && !connecting?.start
            ? 100
            : 0
        } source transition-opacity duration-300 w-4 h-4 my-auto ml-5`}
        {...trackHovering(['requiredBy', 'handles'], ['requiredBy'])}
        id={`${props.id}_target`}
        // onClick={() => {--
        // TODO: Implement 'add job' menu functionality
        // }}
        draggable
        onDragStart={startConnecting('source')}
      >
        <ConnectorIcon
          filled={hovering['requiredBy']}
          subtraction={altAction}
        />
      </button>

      <Handle
        type="source"
        className="opacity-0 cursor-default"
        position={Position.Right}
        id={`${props.id}_source`}
      ></Handle>
      <Handle
        className="opacity-0 cursor-default"
        id={`${props.id}_target`}
        type="target"
        position={Position.Left}
      />
    </div>
  );
};

export default JobNode;
