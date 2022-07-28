import { ReactElement, useState } from 'react';
import ExpandIcon from '../../icons/ui/ExpandIcon';

export interface CollapsibleListProps {
  title: string | ReactElement;
  titleExpanded?: ReactElement;
  children: ReactElement;
  expanded?: boolean;
  classNameExpanded?: string;
  className?: string;
  onChange?: (expanded: boolean) => void;
  pinned?: ReactElement;
}

const CollapsibleList = (props: CollapsibleListProps) => {
  const [expanded, setExpanded] = useState(props.expanded || false);

  return (
    <div
      className={`transition-all ${
        props.classNameExpanded && expanded
          ? props.classNameExpanded
          : props.className
      }`}
    >
      <div className="flex flex-row">
        <div className=" w-10/12">
          <div className="flex flex-row">
            <button
              onClick={(e) => {
                const newExpanded = !expanded;

                setExpanded(newExpanded);
                props.onChange && props.onChange(newExpanded);
              }}
              type="button"
              className={`flex hover:bg-circle-gray-300 border-white border rounded ${'px-1'}`}
            >
              <ExpandIcon className="w-3 h-5 mx-auto" expanded={expanded} />
            </button>
            <p className="mx-2 font-bold leading-6 tracking-wide">
              {props.title}
            </p>
          </div>
          {expanded && props.titleExpanded}
        </div>
        {expanded && props.pinned}
      </div>
      {expanded && <div className="ml-4">{props.children}</div>}
    </div>
  );
};

export default CollapsibleList;
