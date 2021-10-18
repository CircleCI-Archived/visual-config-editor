import Editor from '@monaco-editor/react';
import { useStoreState } from '../../state/Hooks';

const EditorPane = () => {
  const config = useStoreState((state) => state.config);

  const configYAML = () => {
    const yml = config?.stringify();
    const matchSDKComment = yml?.match('# SDK Version: .*\n');

    if (yml && matchSDKComment && matchSDKComment.index) {
      const comment = `# VCE Version: 0.1.0\n# Modeled with the CircleCI visual config editor.\n# For more information, see https://github.com/CircleCI-Public/visual-config-editor\n`;
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
    <div className="bg-circle-gray-900 w-full h-full border-r-2 border-circle-green-light">
      <div className="inline-flex border-b text-xl pt-4 pb-0 border-circle-gray-800 w-full font-bold">
        <div className="border-b-4 pl-4 pr-4 pb-2 w-max text-white border-circle-green">
          CODE EDITOR
        </div>
      </div>
      <Editor
        theme="vs-dark"
        className="h-96"
        defaultLanguage="yaml"
        defaultValue=""
        value={configYAML()}
      />
    </div>
  );
};

export default EditorPane;
