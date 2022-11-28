import { useCallback, useMemo } from "react";
import { FlowMode } from "../../state/FlowStore";
import { useStoreState, useStoreActions } from "../../state/Hooks"
import { Button } from "../atoms/Button"
import PreviewToolbox from "../containers/PreviewToolbox"

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
          const className = i == 0 ? 'mr-0 rounded-r-none' : i == buttons.length - 1 ? 'ml-0 rounded-l-none' : 'mx-0 rounded-none';
          return (<Button key={flowMapping.mode} selected={mode == flowMapping.mode} variant="secondary" className={className} onClick={() => updateMode(flowMapping.mode)}>
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
