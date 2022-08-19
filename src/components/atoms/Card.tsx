import { Button } from './Button';

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
      <div className="p-4 w-full pr-1 border-circle-gray-300 border rounded text-left  max-h-36 flex flex-row">
        <div className="flex flex-col flex-1">
          <div className="flex flex-row">
            {props.icon}
            <p className="font-medium">{props.title}</p>
          </div>
          {description && (
            <p className="text-sm mt-2 leading-4 text-circle-gray-500 overflow-ellipsis max-h-32 overflow-hidden">
              {truncate && description.length > truncate
                ? description?.slice(0, truncate) + '...'
                : description}
            </p>
          )}
        </div>
        <div className="flex flex-col px-2">
          {props.pinned && (
            <div className="ml-auto z-10 rounded ">{props.pinned}</div>
          )}
          <div className="flex-1 flex">
            <Button
              ariaLabel='Select'
              title="Select"
              margin="0"
              type="button"
              variant="secondary"
              className={'my-auto'}
              onClick={props.onClick}
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
