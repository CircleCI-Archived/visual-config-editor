import { IconProps } from '../IconProps';

export interface ToolTipProps {
  size?: number;
  direction: 'right' | 'left' | 'top' | 'bottom';
}

const ToolTipPointerIcon = (props: IconProps & ToolTipProps) => {
  const size = props.size || 8;

  const direction = {
    right: `M 0 0 L ${size / 2} ${size / 2} L 0 ${size}`,
    left: `M 0 ${size} L ${size / 2} ${size / 2} L 0 0`,
    top: `M 0 ${size / 2} L ${size / 2} 0 L ${size} ${size / 2}`,
    bottom: `M 0 0 L ${size / 2} ${size} L ${size} 0`,
  };

  const horizontal = props.direction === 'top' || props.direction === 'bottom';

  return (
    <svg
      viewBox={`0 0 ${horizontal ? size : size / 2} ${
        horizontal ? size / 2 : size
      }`}
      className={props.className}
      fill={props.color || '#000000'}
    >
      <path d={direction[props.direction]} />
    </svg>
  );
};

export default ToolTipPointerIcon;
