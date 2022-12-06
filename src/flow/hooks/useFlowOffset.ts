import { useCallback } from "react";
import { useReactFlow, XYPosition } from "reactflow";
import { useStoreState } from "../../core/state/Hooks";
import { DataModel } from "../../core/state/Store";

type FlowEvent = (position: XYPosition, dragging?: DataModel) => void;

export function useFlowOffset(func: FlowEvent, offset?: DOMRect, deps?: any[]) {
  const { project } = useReactFlow();

  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const eventPos = project({ x: e.clientX, y: e.clientY - (offset?.y || 0)});

    func(eventPos);

    e.preventDefault();
  }, deps ? [project, ...deps] : [project]);
}
