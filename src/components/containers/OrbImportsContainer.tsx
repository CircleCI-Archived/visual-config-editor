import { useRef } from 'react';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { OrbDefinitionMenuNav } from '../menus/definitions/OrbImportMenu';
import CollapsibleList from './CollapsibleList';

export interface OrbImportProps {
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
}

const OrbImportsContainer = (props: OrbImportProps) => {
  const items = ['test'];
  // const items = useStoreState(props.type.store.get);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const guideStep = useStoreState((state) => state.guideStep);
  const ref = useRef(null);

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
                component: OrbDefinitionMenuNav,
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
          {items && items.length > 0 ? (
            items.map((item) => <div></div>)
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
