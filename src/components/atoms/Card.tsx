export interface CardProps {
  description?: string;
  title: string;
  icon?: React.ReactElement;
  pinned?: React.ReactElement;
  truncate?: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Card = ({ truncate, description, ...props }: CardProps) => {
  return (
    <div className="pb-4">
      <button
        type="button"
        className="p-4 w-full border-circle-gray-300 border rounded text-left hover:border-circle-gray-700 max-h-36"
        onClick={props.onClick}
      >
        <div className="flex flex-row">
          {props.icon}
          <p className="font-bold">{props.title}</p>
          <div className="ml-auto z-10">{props.pinned}</div>
        </div>
        {description && (
          <p className="text-sm mt-1 leading-4 text-circle-gray-500 overflow-ellipsis max-h-32 overflow-hidden">
            {truncate && description.length > truncate
              ? description?.slice(0, truncate) + '...'
              : description}
          </p>
        )}
      </button>
    </div>
  );
};

export default Card;
