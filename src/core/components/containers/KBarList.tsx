import * as React from 'react';

import {
  ActionId,
  ActionImpl,
  createAction,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from 'kbar';

const KBarList = (props: any) => {
  const initialActions = [
    {
      id: 'Inspector',
      name: 'Inspector Pane',
      shortcut: ['n'],
      keywords: 'core elements',
      section: 'Commands',
      subtitle: 'Create and edit config components.',
      perform: () => {
        const focus = document.getElementById('Naviagtion-Pane');

        if (focus) {
          focus.click();
          focus.scrollIntoView();
        }
      },
    },
    {
      id: 'Editor',
      name: 'Editor Pane',
      shortcut: ['e'],
      keywords: 'yaml config',

      perform: () => {
        const focus = document.getElementById('Editor-Pane');

        if (focus) {
          focus.scrollIntoView();
        }
      },
    },
    {
      id: 'Workflow',
      name: 'Workflow Pane',
      subtitle: 'Orchestrate your CI workflow.',
      shortcut: ['w'],
      keywords: 'jobs workflow',

      perform: () => {
        const focus = document.getElementById('Workflows-Pane');

        if (focus) {
          focus.click();
          focus.scrollIntoView();
        }
      },
    },

    createAction({
      name: 'View Source',
      subtitle: 'View the source on GitHub.',
      shortcut: ['s'],
      keywords: 'source code',
      section: 'Links',
      perform: () =>
        window.open(
          'https://github.com/CircleCI-Public/visual-config-editor',
          '_blank',
        ),
    }),
    createAction({
      name: 'Documentation',
      shortcut: ['d', 'h'],
      keywords: 'documentation help',
      subtitle: 'Open CircleCI documentation homepage.',
      section: 'Links',
      perform: () => window.open('https://circleci.com/docs', '_blank'),
    }),
  ];

  return (
    <KBarProvider
      options={{
        enableHistory: true,
      }}
      actions={initialActions}
    >
      <KBarPortal>
        <KBarPositioner className="z-50">
          <KBarAnimator className="px-3 bg-white rounded-lg py-4 w-1/2 box-border overflow-hidden">
            <KBarSearch className="px-3 py-4 w-full mb-1" />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  );
};

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="px-2 py-4 uppercase text-circle-gray-500 text-xs font-semibold">
            {item}
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId || ''}
          />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId,
      );

      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        className="px-3 py-4 w-full justify-between flex items-center cursor-pointer hover:bg-circle-gray-100"
      >
        <div className="flex gap-2 items-center text-sm">
          {action.icon && action.icon}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    ></span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: 'grid', gridAutoFlow: 'column', gap: '4px' }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: '4px 6px',
                  background: 'rgba(0 0 0 / .1)',
                  borderRadius: '4px',
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);

export default KBarList;
