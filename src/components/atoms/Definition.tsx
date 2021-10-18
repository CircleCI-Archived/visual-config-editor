import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions } from '../../state/Hooks';

const Definition = (props: { data: any, type: ComponentMapping }) => {
  const Summary = props.type.components.summary;
  const inspector = useStoreActions((actions) => actions.inspect);

  return (
    <button className="w-full p-3 cursor-pointer text-left pl-10 text-circle-black bg-white border border-circle-gray-300 rounded-md" draggable="true"
      onDragStart={(e) => {
        const type = props.type;

        if (type?.dragTarget) {
          let configData = props.data;

          if (type.node?.transform) {
            configData = type.node.transform(configData);
          }

          e.dataTransfer.setData(type.dragTarget, JSON.stringify({ type: type.node?.type || type.type, data: configData }));
        }
      }}
      onClick={(e) => {
        inspector({ mode: 'editing', data: props.data, dataType: props.type })
      }}
    >
      <Summary data={props.data} />
    </button>
  );
}

export default Definition;