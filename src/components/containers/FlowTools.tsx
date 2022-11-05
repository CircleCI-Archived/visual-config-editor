import { Button } from "../atoms/Button"
import PreviewToolbox from "./PreviewToolbox"

const FlowTools = () => {
    return (<div className="mr-2 px-4 flex flex-row border-r border-r-circle-gray-300">   
        <Button variant="secondary" className="mr-0 rounded-r-none">Connect</Button>
        <Button variant="secondary" className="ml-0 rounded-l-none">Move</Button>
      <PreviewToolbox />
    </div>)
}

export { FlowTools }