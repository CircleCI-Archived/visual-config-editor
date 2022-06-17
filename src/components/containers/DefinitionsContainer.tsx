import { useRef } from 'react';
import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import ComponentInfo from '../atoms/ComponentInfo';
import Definition from '../atoms/Definition';
import {
  InspectorDefinitionMenu,
  InspectorDefinitionMenuNav,
} from '../menus/definitions/InspectorDefinitionMenu';
import { navSubTypeMenu } from '../menus/SubTypeMenu';
import CollapsibleList from './CollapsibleList';
import GuideContainer from './GuideContainer';

export interface DefinitionsProps {
  type: ComponentMapping;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
}

const DefinitionsContainer = (props: DefinitionsProps) => {
  const items = useStoreState(props.type.store.get);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const guideStep = useStoreState((state) => state.guideStep);
  const ref = useRef(null);

  return (
    <div ref={ref} className="w-full p-4 pb-0">
      {props.type.guide && guideStep === props.type.guide.step && (
        <GuideContainer target={ref}>{props.type.guide.info}</GuideContainer>
      )}
      <CollapsibleList
        title={props.type.name.plural}
        expanded={props.expanded}
        onChange={props.onChange}
        titleExpanded={
          <button
            onClick={() =>
              navigateTo(
                props.type.subtypes?.component
                  ? navSubTypeMenu({
                      typePage: props.type.subtypes?.component,
                      menuPage: InspectorDefinitionMenu,
                      menuProps: { dataType: props.type },
                    })
                  : {
                      component: InspectorDefinitionMenuNav,
                      props: { dataType: props.type },
                    },
              )
            }
            className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
          >
            New
          </button>
        }
      >
        <div className="w-full pl-2 pt-2">
          <ComponentInfo type={props.type} />
          {items && items.length > 0 ? (
            items?.map((item) => (
              <Definition data={item} key={item.name} type={props.type} />
            ))
          ) : (
            <div className="font-medium text-sm text-circle-gray-500">
              No {props.type.name.plural} found.
            </div>
          )}
        </div>
      </CollapsibleList>
      <div className="w-full p-2 border-b border-circle-gray-300"></div>
    </div>
  );
};

export default DefinitionsContainer;
