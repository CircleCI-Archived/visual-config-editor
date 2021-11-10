import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import CollapsibleList from '../atoms/CollapsibleList';
import Definition from '../atoms/Definition';
import CreateDefinitionPane from '../panes/definitions/CreateDefinitionPane';

export interface DefinitionsProps {
  type: ComponentMapping;
}

const DefinitionsContainer = (props: DefinitionsProps) => {
  const items = useStoreState(props.type.store.get);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <div className="w-full p-4 pb-0">
      <CollapsibleList
        title={props.type.name.plural}
        titleExpanded={
          <button
            onClick={() =>
              navigateTo({
                component: CreateDefinitionPane,
                props: { dataType: props.type },
              })
            }
            className="ml-auto tracking-wide leading-6 text-sm text-circle-blue font-medium mr-2"
          >
            New
          </button>
        }
      >
        <div className="w-full p-2 pb-0">
          {(items || []).length > 0 ? (
            items?.map((item) => <Definition data={item} type={props.type} />)
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
