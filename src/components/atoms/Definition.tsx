import ConfigData, { componentToType } from '../../data/ConfigData';
import { useStoreActions } from '../../state/Hooks';

const Definition = (props: { data: any, type: ConfigData }) => {
  const Summary = props.type.components.summary;
  const inspector = useStoreActions((actions) => actions.inspect);

  return (
    <button className="w-full p-2 cursor-pointer text-white font-semibold bg-circle-blue rounded-md" draggable="true"
      onDragStart={(e) => {
        const node = props.type.node;

        if (node?.dragTarget) {
          let configData = props.data;

          if (node.transform) {
            configData = node.transform(configData);
          }

          e.dataTransfer.setData(node.dragTarget, JSON.stringify({ type: node.type, data: configData }));
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