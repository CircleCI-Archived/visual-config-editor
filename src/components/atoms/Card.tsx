export interface CardProps {
  description?: string;
  title: string;
  pinned?: React.ReactElement;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Card = (props: CardProps) => {
  return (
    <button
      type="button"
      className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
      onClick={props.onClick}
    >
      <div className="flex flex-row">
        <p className="font-bold">{props.title}</p>
        <div className="ml-auto z-10">{props.pinned}</div>
      </div>
      <p className="text-sm mt-1 leading-4 text-circle-gray-500">
        {props.description}
      </p>
    </button>
  );
};

export default Card;
