import Editor, { DiffEditor } from '@monaco-editor/react';
import { useStoreState } from '../../state/Hooks';

const EditorPane = () => {
  const config = useStoreState((state) => state.config);
  const editingConfig = useStoreState((state) => state.editingConfig);

  const handleEditorValidation = (markers: any) => {
    markers.forEach((marker: any) => console.log("onValidate", marker.message))
  }

  const configYAML = (yml: string) => {
    const matchSDKComment = yml?.match('# SDK Version: .*\n');

    if (yml && matchSDKComment && matchSDKComment.index) {
      const comment = `# VCE Version: 0.2.0\n# Modeled with the CircleCI visual config editor.\n# For more information, see https://github.com/CircleCI-Public/visual-config-editor\n`;
      const endOfSDKComment = matchSDKComment.index + matchSDKComment[0].length;

      return (
        yml.substring(0, endOfSDKComment) +
        comment +
        yml.substring(endOfSDKComment, yml.length)
      );
    }

    return yml;
  };

  return (
    <div className="bg-circle-gray-900 h-2/5 w-full flex flex-col">
      <div className="border-b text-xl border-circle-gray-800 font-bold">
        <div className="ml-4 border-b-4 px-3 py-3 w-max text-sm tracking-wide font-bold text-white border-white">
          CONFIG
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {
          editingConfig ?
            (<DiffEditor
              theme="vs-dark"
              language="yaml"
              original={config && configYAML(config)}
              modified={editingConfig && configYAML(editingConfig)}
            />)
            :
            (<Editor
              theme="vs-dark"
              language="yaml"
              value={config && configYAML(config)}
              onValidate={handleEditorValidation}
            />
            )
        }
      </div>
    </div>
  );
};

export default EditorPane;
