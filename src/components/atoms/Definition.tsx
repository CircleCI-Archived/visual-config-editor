import ConfigData, { componentToType } from '../../data/ConfigData';

const Definition = (props: { data: any, type: ConfigData }) => {
  const Summary = props.type.components.summary;

  return (
    <button className="w-full p-2 cursor-pointer text-white font-semibold bg-circle-blue rounded-md" draggable="true"
      onDragStart={(e) => {
        if (props.type.node?.dragTarget) {
          e.dataTransfer.setData(props.type.node?.dragTarget, JSON.stringify(props.data));
        }
      }}
      onClick={(e) => {
        // select and show inspector 
      }}
    >
      <Summary data={props.data}></Summary>
    </button>
  );
}

export default Definition;