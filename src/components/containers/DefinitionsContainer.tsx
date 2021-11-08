import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import CollapsibleList from '../atoms/CollapsibleList';
import Definition from '../atoms/Definition';

export interface DefinitionsProps {
  type: ComponentMapping;
}

const DefinitionsContainer = (props: DefinitionsProps) => {
  const getIcon = () => {
    let iconComponent = props.type.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className="ml-1 mr-3 w-8 h-8" />;
    }
  };

  const items = useStoreState(props.type.store.get);
  const inspect = useStoreActions((actions) => actions.setInspecting);

  return (
    <div className="w-full p-4 pb-0">
      <CollapsibleList
        children={
          <div className="w-full p-2">
            {(items || []).length > 0 ? (
              items?.map((item) => <Definition data={item} type={props.type} />)
            ) : (
              <div className="font-medium text-sm text-circle-gray-500">No {props.type.name.plural} found.</div>
            )}
          </div>
        }
        title={props.type.name.plural}
        titleExpanded={
          <button
            onClick={() => inspect({ dataType: props.type, mode: 'creating' })}
            className="ml-auto tracking-wide leading-6 text-sm text-circle-blue font-medium mr-2"
          >
            New
          </button>
        }
      ></CollapsibleList>
      <div className="w-full p-2 border-b border-circle-gray-300"></div>
    </div>
  );
};

export default DefinitionsContainer;
