import { ReactElement, useState } from 'react';
import ExpandIcon from '../../icons/ui/ExpandIcon';

export interface CollapsibleListProps {
  title: string;
  titleExpanded?: ReactElement;
  children: ReactElement;
  open?: boolean;
  className?: string;
}

const CollapsibleList = (props: CollapsibleListProps) => {
  const [expanded, setExpanded] = useState(props.open || false);
  
  return (
    <div className={props.className}>
      <div className="flex flex-row">
        <button
          onClick={(e) => {
            setExpanded(!expanded);
          }}
          type="button"
          className="flex flex-row flex-1"
        >
          <ExpandIcon className="w-3 h-5 mr-1" expanded={expanded} />
          <p className="font-bold leading-5 tracking-wide">
            {props.title}
          </p>
        </button>
        {expanded && props.titleExpanded}
      </div>
      {expanded && <div className="ml-2">{props.children}</div>}
    </div>
  );
};

export default CollapsibleList;
