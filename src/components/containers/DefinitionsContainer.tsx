import { useRef } from 'react';
import InspectableMapping from '../../mappings/InspectableMapping';
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
  type: InspectableMapping;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
}

const DefinitionsContainer = (props: DefinitionsProps) => {
  // the definitions of the current type of inspectable mapping
  const definitions = useStoreState(
    (store) => store.definitions[props.type.key],
  );
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const guideStep = useStoreState((state) => state.guideStep);
  const ref = useRef(null);

  /**
   * Navigate to inspector definition menu,
   * will go to a subtype page if the InspectableMapping type
   * has subtypes defined.
   */
  const navigateToInspector = () => {
    navigateTo(
      props.type.subtypes
        ? navSubTypeMenu({
            typePage: props.type.subtypes?.component,
            menuPage: InspectorDefinitionMenu,
            menuProps: { dataType: props.type, index: -1 },
          })
        : {
            component: InspectorDefinitionMenuNav,
            props: { dataType: props.type, index: -1 },
          },
    );
  };

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
            onClick={navigateToInspector}
            className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
          >
            New
          </button>
        }
      >
        <div className="w-full pl-2 pt-2">
          <ComponentInfo type={props.type} />
          {typeof definitions === 'object' && !Array.isArray(definitions) ? (
            Object.entries(definitions).map(([name, definition], index) => (
              <Definition
                data={definition.value}
                key={name}
                type={props.type}
                index={index}
              />
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
