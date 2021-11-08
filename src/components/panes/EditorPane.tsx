import { Config } from '@circleci/circleci-config-sdk';
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
    <div className="bg-circle-gray-900 h-2/5 flex flex-col border-r-2 border-circle-green-light">
      <div className="border-b text-xl border-circle-gray-800 font-bold">
        <div className="ml-4 border-b-4 px-3 py-3 w-max text-sm tracking-wide font-bold text-white border-white">
          CODE EDITOR
        </div>
      </div>
      <div className="h-full overflow-hidden">
        <Editor
          theme="vs-dark"
          defaultLanguage="yaml"

          defaultValue={new Config().stringify()}
          value={configYAML()}
        />
      </div>
    </div>
  );
};

export default EditorPane;
