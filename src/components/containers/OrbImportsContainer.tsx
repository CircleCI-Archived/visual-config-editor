import { useMemo, useRef } from 'react';
import OrbIcon from '../../icons/components/OrbIcon';
import { mapDefinitions } from '../../state/DefinitionStore';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import AddButton from '../atoms/AddButton';
import ComponentInfo from '../atoms/ComponentInfo';
import { Empty } from '../atoms/Empty';
import { OrbDefinitionMenuNav } from '../menus/definitions/OrbDefinitionsMenu';
import { OrbImportMenuNav } from '../menus/definitions/OrbImportMenu';
import CollapsibleList from './CollapsibleList';

export interface OrbImportProps {
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
}

const OrbImportsContainer = (props: OrbImportProps) => {
  const items = useStoreState((state) => state.definitions.orbs);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  // const guideStep = useStoreState((state) => state.guideStep);
  const ref = useRef(null);
  const orbDefinitions = useMemo(
    () =>
      mapDefinitions(items, (orb) => {
        return (
          <button
            className="w-full mb-2 p-2 text-sm cursor-pointer text-left text-circle-black 
      bg-white border border-circle-gray-300 rounded-md2 flex flex-row"
            onClick={() => {
              navigateTo({
                component: OrbDefinitionMenuNav,
                props: {
                  name: orb.name,
                  namespace: orb.namespace,
                  version: orb.version,
                  description: orb.description,
                  logo_url: orb.logo_url,
                },
              });
            }}
            key={orb.name}
          >
            <img className="ml-1 mr-2 w-5 h-5" src={orb.logo_url} alt="" />
            <p className="text-circle-gray-400">{orb.namespace}/</p>
            {orb.name}
            <div className="ml-auto text-circle-gray-400">{orb.version}</div>
          </button>
        );
      }),
    [items, navigateTo],
  );

  return (
    <div ref={ref} className="w-full px-4 pb-0">
      <CollapsibleList
        title="Orbs"
        expanded={props.expanded}
        onChange={props.onChange}
        className="py-4"
        classNameExpanded="py-4"
        pinned={
          <AddButton
            className="flex ml-auto"
            onClick={() => {
              navigateTo({
                component: OrbImportMenuNav,
                props: {},
              });
            }}
          />
        }
      >
        <div className="w-full pl-2 pt-2">
          {/* <ComponentInfo type={props.type} /> */}
          {orbDefinitions.length > 0 ? (
            orbDefinitions
          ) : (
            <Empty
              label={`No Imported Orbs`}
              Logo={OrbIcon}
              description={
                <>
                  <ComponentInfo
                    docsInfo={{
                      description:
                        'Orbs are reusable snippets of code that help automate repeated processes.',
                      link: 'https://circleci.com/docs/orb-intro',
                    }}
                  />
                  <br />
                  Import an orb by clicking the button above.
                </>
              }
            />
          )}
        </div>
      </CollapsibleList>
      <span className="w-full flex border-b border-circle-gray-300" />
    </div>
  );
};

export default OrbImportsContainer;
