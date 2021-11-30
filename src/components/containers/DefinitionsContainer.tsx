import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import CollapsibleList from './CollapsibleList';
import Definition from '../atoms/Definition';
import {
  CreateDefinitionMenu,
  CreateDefinitionMenuNav,
} from '../menus/definitions/CreateDefinitionMenu';
import SubTypeMenuNav from '../menus/SubTypeMenu';

export interface DefinitionsProps {
  type: ComponentMapping;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
}

const DefinitionsContainer = (props: DefinitionsProps) => {
  const items = useStoreState(props.type.store.get);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <div className="w-full p-4 pb-0">
      <CollapsibleList
        title={props.type.name.plural}
        expanded={props.expanded}
        onChange={props.onChange}
        titleExpanded={
          <button
            onClick={() =>
              navigateTo(
                props.type.subtypes?.component
                  ? {
                      component: SubTypeMenuNav,
                      props: {
                        typePage: props.type.subtypes?.component,
                        menuPage: CreateDefinitionMenu,
                        menuProps: { dataType: props.type },
                      },
                    }
                  : {
                      component: CreateDefinitionMenuNav,
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
          {(items || []).length > 0 ? (
            items?.map((item) => (
              <Definition data={item} key={props.type.type} type={props.type} />
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
