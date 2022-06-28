import {
  ConnectionLineComponentProps,
  useStoreState as flowState,
} from 'react-flow-renderer';
import { useStoreState } from '../../state/Hooks';

const ConnectionLine = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  connectionLineType,
  connectionLineStyle,
}: ConnectionLineComponentProps) => {
  const connecting = useStoreState((state) => state.connecting);
  const transform = flowState((state: any) => state.transform);
  const handle = connecting?.start?.ref?.current as Element;

  if (!handle) {
    return null;
  }

  const bounds = handle.getBoundingClientRect();
  const startX = (bounds.x + bounds.width - transform[0]) / transform[2];
  const startY =
    (bounds.y + bounds.height / 2 - 64 - transform[1]) / transform[2];
  let endX = targetX;
  let endY = targetY;
  const dist = 30;
  const invalid = endX - dist < startX + dist;
  let color = '#76CDFF';

  if (!invalid && connecting?.end?.ref) {
    const snapTo = connecting?.end.ref?.current as Element;

    if (snapTo && connecting?.end?.ref.current !== handle) {
      const snapToBounds = snapTo.getBoundingClientRect();
      endX = (snapToBounds.x - transform[0]) / transform[2];
      endY =
        (snapToBounds.y + snapToBounds.height / 2 - 64 - transform[1]) /
        transform[2];
      color = '#0078CA';
    }
  }

  color = invalid ? '#F24646' : color;

  return (
    <g>
      <path
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        className="animated"
        d={`M${startX},${startY} ${startX + dist},${startY} ${
          startX + dist
        },${startY} ${endX - dist},${endY} ${
          endX - dist
        },${endY} ${endX},${endY}`}
      />
      <circle
        cx={endX}
        cy={endY}
        fill="#fff"
        r={3}
        stroke={color}
        strokeWidth={1.5}
      />
      <circle
        cx={startX - 2}
        cy={startY}
        fill="#fff"
        r={3}
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
  );
};

export default ConnectionLine;
