import React from 'react';
import { EdgeProps, getBezierPath, getMarkerEnd } from 'react-flow-renderer';

export default function Edge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}: EdgeProps) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const gap = 45;

  return (
    <g>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={`M${sourceX - gap * 2},${sourceY} ${sourceX - gap},${sourceY} ${
          sourceX - gap
        },${sourceY} ${targetX + gap},${targetY} ${targetX + gap},${targetY} ${
          targetX + gap * 2
        },${targetY}`}
      />
      {/* <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px' }}
          startOffset="50%"
          textAnchor="middle"
        >
          {'requires'}
        </textPath>
      </text> */}
    </g>
  );
}
