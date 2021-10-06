import ConfigData, { componentToType } from '../../data/ConfigData';
import { useStoreActions } from '../../state/Hooks';

const Definition = (props: { data: any, type: ConfigData }) => {
  const Summary = props.type.components.summary;
  const inspector = useStoreActions((actions) => actions.inspect);

  return (
    <button className="w-full p-2 cursor-pointer text-white font-semibold bg-circle-blue rounded-md" draggable="true"
      onDragStart={(e) => {
        if (props.type.node?.dragTarget) {
          e.dataTransfer.setData(props.type.node?.dragTarget, JSON.stringify(props.data));
        }
      }}
      onClick={(e) => {
        inspector({ mode: 'editing', data: props.data, dataType: props.type })
      }}
    >
      <Summary data={props.data}></Summary>
    </button>
  );
}

export default Definition;