import { ReactElement, useState } from 'react';
import ExpandIcon from '../../icons/ui/ExpandIcon';
import { Button } from '../atoms/Button';

export interface CollapsibleListProps {
  title: string | ReactElement;
  titleExpanded?: ReactElement;
  titleFont?: string;
  children: ReactElement;
  expanded?: boolean;
  classNameExpanded?: string;
  className?: string;
  onChange?: (expanded: boolean) => void;
  pinned?: ReactElement;
}

const CollapsibleList = ({ titleFont, ...props }: CollapsibleListProps) => {
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
        <div className="w-10/12 my-auto">
          <div className="flex flex-row h-8">
            <Button
              title="Expand"
              ariaLabel="Expand"
              onClick={() => {
                const newExpanded = !expanded;

                setExpanded(newExpanded);
                props.onChange && props.onChange(newExpanded);
              }}
              type="button"
              style={{ width: 22, height: 22 }}
              className={`flex items-center hover:bg-circle-gray-250 border-white border mx-0 px-0 py-0 rounded`}
            >
              <ExpandIcon className="w-3 h-5 m-1 mx-auto" expanded={expanded} />
            </Button>
            <h1
              className={`mx-2 ${
                titleFont ? titleFont : 'font-medium text-base'
              } leading-6 tracking-wide`}
            >
              {props.title}
            </h1>
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
