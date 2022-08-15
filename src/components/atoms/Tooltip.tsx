import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import ToolTipPointerIcon from '../../icons/ui/ToolTipPointerIcon';

export type Direction = 'top' | 'bottom' | 'left' | 'right';
export interface ToolTipProps {
  target: MutableRefObject<any>;
  facing?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactElement;
}

const getPos = (
  tooltip: HTMLElement | null,
  target: HTMLElement | null,
  facing?: Direction,
) => {
  const tipRect = tooltip?.getBoundingClientRect();
  const rect = target?.getBoundingClientRect();
  let width = 240;
  let values = {};

  if (tipRect && rect) {
    if (facing === 'bottom') {
      values = {
        top: rect.y - tipRect?.height + 4,
        left: rect.x - width / 2 + rect.width / 2,
      };
    }
  }

  return { ...values, width };
};

const ToolTip = ({ target, facing, children }: ToolTipProps) => {
  const ref = useRef(null);
  const [pos, setPos] = useState(getPos(ref.current, target.current, facing));
  useEffect(() => {
    setPos(getPos(ref.current, target.current, facing));
  }, [target, ref, facing]);

  return (
    <div style={pos} ref={ref} className="fixed flex z-30 flex-col">
      {ref.current && (
        <>
          <div className="text-white bg-circle-gray-750 text-sm rounded p-2">
            {children}
          </div>
          <ToolTipPointerIcon
            color="#343434"
            className="h-3"
            direction={facing || 'right'}
          />
        </>
      )}
    </div>
  );
};

export default ToolTip;
