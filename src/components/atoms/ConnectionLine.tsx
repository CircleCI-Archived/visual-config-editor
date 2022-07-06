import {
  ConnectionLineComponentProps,
  useStoreState as flowState,
} from 'react-flow-renderer';
import { useStoreState } from '../../state/Hooks';

const getPos = (isSource: boolean, bounds: DOMRect, transform: number[]) => {
  let x, y;

  if (isSource) {
    x = (bounds.x + bounds.width - transform[0]) / transform[2];
  } else {
    x = (bounds.x - transform[0]) / transform[2];
  }

  y = (bounds.y + bounds.height / 2 - 60 - transform[1]) / transform[2];

  return { x, y };
};

const ConnectionLine = ({ targetX, targetY }: ConnectionLineComponentProps) => {
  const connecting = useStoreState((state) => state.connecting);
  const altAction = useStoreState((state) => state.altAction);
  const transform = flowState((state: any) => state.transform);
  const handle = connecting?.start?.ref?.current as Element;
  const isSource = connecting?.start?.id.connectionHandleType === 'source';

  if (!handle) {
    return null;
  }

  const bounds = handle.getBoundingClientRect();
  const start = getPos(isSource, bounds, transform);
  let end = { x: targetX, y: targetY };
  const dist = 30 * (isSource ? 1 : -1);
  const invalid = isSource ? end.x < start.x : end.y > start.x;
  let color = '#76CDFF';

  if (!invalid && connecting?.end?.ref) {
    const snapTo = connecting?.end.ref?.current as Element;

    if (snapTo && connecting?.end?.ref.current !== handle) {
      const snapToBounds = snapTo.getBoundingClientRect();
      end = getPos(!isSource, snapToBounds, transform);
      color = '#0078CA';
    }
  }

  color = invalid || altAction ? '#F24646' : color;

  return (
    <g>
      <path
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        className="animated"
        d={`M${start.x},${start.y} ${start.x + dist},${start.y} ${
          start.x + dist
        },${start.y} ${end.x - dist},${end.y} ${end.x - dist},${end.y} ${
          end.x
        },${end.y}`}
      />
      <circle
        cx={end.x}
        cy={end.y}
        fill="#fff"
        r={3}
        stroke={color}
        strokeWidth={1.5}
      />
      <circle
        cx={start.x - 2}
        cy={start.y}
        fill="#fff"
        r={3}
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
  );
};

export default ConnectionLine;
