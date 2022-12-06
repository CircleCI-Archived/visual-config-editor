import { useCallback, useMemo } from "react";
import { Button } from "../../core/components/atoms/Button";
import PreviewToolbox from "../../core/components/containers/PreviewToolbox";
import { useStoreActions, useStoreState } from "../../core/state/Hooks";
import { FlowMode } from "../state/FlowStore";

const buttons = [
  {
    text: 'Select',
    mode: FlowMode.SELECT,
  },
  {
    text: 'Connect',
    mode: FlowMode.CONNECT,
  },
  {
    text: 'Move',
    mode: FlowMode.MOVE,
  }
]

const FlowTools = () => {
    const mode = useStoreState((state) => state.mode);
    const setMode = useStoreActions((actions) => actions.setMode)

    const updateMode = useCallback((mode: FlowMode) => {
      setMode(mode);
    }, [mode, setMode])

    const Buttons = useMemo(() => {
      return buttons.map((flowMapping, i) => {
        const className = i == 0 ? 'ml-3 bg-red rounded-r-none' : i == buttons.length - 1 ? 'mr-3 rounded-l-none' : 'mx-0 rounded-l-none rounded-r-none';
          return (<Button key={flowMapping.mode} selected={mode == flowMapping.mode} variant="secondary" margin="0" className={className} onClick={() => updateMode(flowMapping.mode)}>
            {flowMapping.text}
            </Button>)
      })
    }, [mode, updateMode ])

    return (<div className="mr-2 px-4 flex flex-row border-r border-r-circle-gray-300">
        {Buttons}
      <PreviewToolbox />
    </div>)
}

export { FlowTools }
