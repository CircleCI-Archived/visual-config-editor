import { useRef } from 'react';
import InspectableMapping from '../../mappings/InspectableMapping';
import { mapDefinitions, NamedGenerable } from '../../state/DefinitionStore';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import AddButton from '../atoms/AddButton';
import ComponentInfo from '../atoms/ComponentInfo';
import Definition from '../atoms/Definition';
import { Empty } from '../atoms/Empty';
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

const DefinitionsContainer = ({
  type,
  expanded,
  onChange,
}: DefinitionsProps) => {
  // the definitions of the current type of inspectable mapping
  const definitions = useStoreState((store) => store.definitions);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const guideStep = useStoreState((state) => state.guideStep);
  const ref = useRef(null);
  const hasDefinitions = Object.values(definitions[type.key]).length > 0;
  const requirements: string[] = [];

  type.requirements?.forEach((requirement) => {
    if (!requirement.test(definitions)) {
      requirements.push(requirement.message);
    }
  });

  /**
   * Navigate to inspector definition menu,
   * will go to a subtype page if the InspectableMapping type
   * has subtypes defined.
   */
  const navigateToInspector = () => {
    navigateTo(
      type.subtypes
        ? navSubTypeMenu({
            typePage: type.subtypes?.component,
            menuPage: InspectorDefinitionMenu,
            menuProps: { dataType: type, index: -1 },
          })
        : {
            component: InspectorDefinitionMenuNav,
            props: { dataType: type, index: -1 },
          },
    );
  };

  return (
    <div ref={ref} className="w-full px-4 pb-0">
      {type.guide && guideStep === type.guide.step && (
        <GuideContainer target={ref}>{type.guide.info}</GuideContainer>
      )}
      <CollapsibleList
        title={type.name.plural}
        expanded={expanded}
        className="py-4"
        classNameExpanded="py-4 "
        onChange={onChange}
        pinned={
          <>
            {requirements.length === 0 && (
              <AddButton
                className="flex ml-auto"
                onClick={navigateToInspector}
              />
            )}
          </>
        }
        titleExpanded={
          <>
            {hasDefinitions && (
              <div className="p-4 px-8">
                <ComponentInfo type={type} />
              </div>
            )}
          </>
        }
      >
        <div className="w-full pl-2 pt-2">
          {hasDefinitions ? (
            mapDefinitions<NamedGenerable>(
              definitions[type.key],
              (definition, index) => (
                <Definition
                  data={definition}
                  key={definition.name}
                  type={type}
                  index={index}
                />
              ),
            )
          ) : (
            <Empty
              label={`No Available ${type.name.plural}`}
              Logo={type.components.icon}
              description={
                <>
                  <ComponentInfo type={type} />
                  <br />
                  <br />
                  {requirements.length > 0
                    ? requirements
                    : `Define a new ${type.name.singular} by clicking the button
                  above.`}
                  <br />
                </>
              }
            />
          )}
        </div>
      </CollapsibleList>
      <div className="w-full border-b border-circle-gray-300"></div>
    </div>
  );
};

export default DefinitionsContainer;
