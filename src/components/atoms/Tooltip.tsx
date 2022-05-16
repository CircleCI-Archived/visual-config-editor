import { MutableRefObject, ReactElement, useEffect, useState } from 'react';
import ToolTipPointerIcon from '../../icons/ui/ToolTipPointerIcon';

export interface ToolTipProps {
  target: MutableRefObject<any>;
  pointerColor?: string;
  pointerClass?: string;
  offsetX?: number;
  offsetY?: number;
  centered?: boolean;
  facing?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactElement;
}

const ToolTip = (props: ToolTipProps) => {
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const updatePos = () => {
    const rect = props.target.current.getBoundingClientRect();

    setPos({ left: rect.x - rect.width - 32, top: rect.y + 6 });
  };

  useEffect(() => {
    updatePos();
  });

  return (
    <div style={pos} className="fixed flex z-10">
      {props.children}
      <ToolTipPointerIcon
        color="#FFFFFF"
        className="h-3 mt-4"
        direction="right"
      />
    </div>
  );
};

export default ToolTip;
