import { ReactElement, useState } from 'react';
import ExpandIcon from '../../icons/ui/ExpandIcon';

export interface CollapsibleListProps {
  title: string;
  titleExpanded?: ReactElement;
  children: ReactElement;
  expanded?: boolean;
  classNameExpanded?: string;
  className?: string;
  onChange?: (expanded: boolean) => void;
}

const CollapsibleList = (props: CollapsibleListProps) => {
  const [expanded, setExpanded] = useState(props.expanded || false);

  return (
    <div className={props.classNameExpanded && expanded ? props.classNameExpanded : props.className}>
      <div className="flex flex-row">
        <button
          onClick={(e) => {
            const newExpanded = !expanded;

            setExpanded(newExpanded);
            props.onChange && props.onChange(newExpanded);
          }}
          type="button"
          className="flex flex-row flex-1"
        >
          <ExpandIcon className="w-3 h-5 mr-3" expanded={expanded} />
          <p className="font-bold leading-5 tracking-wide">{props.title}</p>
        </button>
        {expanded && props.titleExpanded}
      </div>
      {expanded && <div className="ml-4">{props.children}</div>}
    </div>
  );
};

export default CollapsibleList;
