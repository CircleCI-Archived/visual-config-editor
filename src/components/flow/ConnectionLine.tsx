import { ConnectionLineComponentProps, getBezierPath, MarkerType } from 'reactflow';
import { useStoreState } from '../../state/Hooks';

function ConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle, fromNode, fromHandle }: ConnectionLineComponentProps) {
    const stepDist = 20;
    const realStartX = fromX + (fromNode?.width || 2) / 2;
    const isSource = fromHandle?.position == 'right';
    useStoreState((state) => state.mode);
    const valid = isSource ? toX >= realStartX + stepDist : toX <= realStartX + stepDist;
    const color = '#76CDFF';

    const edgePath = valid ? getSteppedPath(realStartX, fromY, toX, toY, stepDist) : `M${realStartX},${fromY} ${realStartX + stepDist},${fromY}`;

    return (
        <g>
        <defs>
            <marker
            id="triangle"
            viewBox="0 0 4 4"
            refX="1"
            refY="2"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="4"
            orient="auto">
            <path d="M 0 0 L 4 2 L 0 4 z" fill={color} strokeWidth={1.5}/>
            </marker>
        </defs>
        <path style={connectionLineStyle} className="animated" fill="none" strokeWidth={1.5} stroke={color} d={edgePath} markerEnd="url(#triangle)" />
        {valid && <circle cx={toX} cy={toY} fill="white" r={3} stroke={color} strokeWidth={1.5} /> }
        </g>
    );
}

export function getSteppedPath(sourceX: number, sourceY: number, targetX: number, targetY: number, dist: number ) {
    return `M${sourceX},${sourceY} ${sourceX + dist},${sourceY} ${
        sourceX + dist
      },${sourceY} ${targetX - dist},${targetY} ${targetX - dist},${targetY} ${
        targetX
      },${targetY}`;
}

export default ConnectionLine;
