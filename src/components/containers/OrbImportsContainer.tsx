import { useRef } from 'react';
import { mapDefinitions } from '../../state/DefinitionStore';
import { useStoreActions, useStoreState } from '../../state/Hooks';
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
  const orbDefinitions = mapDefinitions(items, (orb) => {
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
      >
        <img className="ml-1 mr-2 w-5 h-5" src={orb.logo_url} alt="" />
        <p className="text-circle-gray-400">{orb.namespace}/</p>
        {orb.name}
        <div className="ml-auto text-circle-gray-400">{orb.version}</div>
      </button>
    );
  });

  return (
    <div ref={ref} className="w-full p-4 pb-0">
      <CollapsibleList
        title="Orbs"
        expanded={props.expanded}
        onChange={props.onChange}
        titleExpanded={
          <button
            onClick={() => {
              navigateTo({
                component: OrbImportMenuNav,
                props: {},
              });
            }}
            className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
          >
            Import
          </button>
        }
      >
        <div className="w-full pl-2 pt-2">
          {/* <ComponentInfo type={props.type} /> */}
          {orbDefinitions.length > 0 ? (
            orbDefinitions
          ) : (
            <div className="font-medium text-sm text-circle-gray-500">
              No orbs imported.
            </div>
          )}
        </div>
      </CollapsibleList>
      <div className="w-full p-2 border-b border-circle-gray-300"></div>
    </div>
  );
};

export default OrbImportsContainer;
