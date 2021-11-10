import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions } from '../../state/Hooks';
import EditDefinitionPane from '../panes/definitions/EditDefinitionPane';

const Definition = (props: { data: any; type: ComponentMapping }) => {
  const Summary = props.type.components.summary;
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const setDragging = useStoreActions((actions) => actions.setDragging);

  return (
    <button
      className="w-full mb-2 p-2 text-sm cursor-pointer text-left text-circle-black 
      bg-white border border-circle-gray-300 rounded-md2"
      draggable="true"
      onDragStart={(e) => {
        const type = props.type;

        if (type?.dragTarget) {
          setDragging({ dataType: type, data: props.data });
        }
      }}
      onClick={(e) => {
        navigateTo({
          component: EditDefinitionPane,
          props: { data: props.data, dataType: props.type },
        });
      }}
    >
      <Summary data={props.data} />
    </button>
  );
};

export default Definition;
