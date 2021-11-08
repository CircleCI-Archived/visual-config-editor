import { ReactElement, useState } from 'react';
import ExpandIcon from '../../icons/ExpandIcon';

export interface CollapsibleListProps {
  title: string;
  titleExpanded: ReactElement;
  children: ReactElement;
  open?: boolean;
}

const CollapsibleList = (props: CollapsibleListProps) => {
  const [expanded, setExpanded] = useState(props.open || false);
  const display = (element: ReactElement) => {
    if (expanded) {
      return element;
    }
  };

  return (
    <div>
      <div className="flex flex-row">
        <button
          onClick={(e) => {
            setExpanded(!expanded);
          }}
          className="flex flex-row"
        >
          <ExpandIcon className="w-6 h-6 p-1" expanded={expanded} />
          <p className="font-bold leading-6 tracking-wide text-sm">
            {props.title}
          </p>
        </button>
        {display(props.titleExpanded)}
      </div>
      {display(<div className="ml-4">{props.children}</div>)}
    </div>
  );
};

export default CollapsibleList;
