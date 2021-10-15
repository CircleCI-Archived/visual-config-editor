import Editor from "@monaco-editor/react";
import { useStoreState } from "../../state/Hooks";

const EditorPane = () => {
  const config = useStoreState((state) => state.config);

  return (<div className='bg-circle-gray-900 w-full h-full border-r-2 border-circle-green-light'>
    <div className="inline-flex border-b text-xl pt-4 pb-0 border-circle-gray-800 w-full font-bold">
      <div className="border-b-4 pl-4 pr-4 pb-2 w-max text-white border-circle-green">
        CODE EDITOR
      </div>
    </div>
    <Editor
      theme="vs-dark"
      className="flex-grow"
      defaultLanguage="yaml"
      defaultValue=""
      value={config?.stringify()}
    />
  </div>)
};

export default EditorPane;