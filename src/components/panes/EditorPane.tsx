import Editor, { DiffEditor } from '@monaco-editor/react';
import CopyIcon from '../../icons/ui/CopyIcon';
import { useStoreState } from '../../state/Hooks';
import { version } from '../../version.json';
import { Button } from '../atoms/Button';
import { OpenConfig } from '../atoms/OpenConfig';

const EditorPane = (props: any) => {
  const config = useStoreState((state) => state.config);
  const editingConfig = useStoreState((state) => state.editingConfig);

  const configYAML = (yml: string) => {
    const matchSDKComment = yml?.match('# SDK Version: .*\n');

    if (yml && matchSDKComment && matchSDKComment.index) {
      const comment = `# VCE Version: ${version}\n# Modeled with the CircleCI visual config editor.\n# For more information, see https://github.com/CircleCI-Public/visual-config-editor\n`;
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
    <div
      id="Editor-Pane"
      aria-label="Editor Pane"
      className="bg-circle-gray-900 h-2/5 w-full flex flex-col"
    >
      <div className="border-b text-xl border-circle-gray-800 font-bold flex flex-row">
        <div className="ml-4 border-b-4 px-3 py-2 pt-4 w-max text-sm tracking-wide font-bold text-white border-white">
          CONFIG
        </div>
        <div className="p-2 ml-auto flex flex-row">
          <Button
            variant={'secondary'}
            disabled={!config}
            className="w-min whitespace-nowrap flex ml-auto w-10"
            onClick={() => {
              if (config) {
                navigator.clipboard.writeText(configYAML(config));
              }
            }}
          >
            <CopyIcon className="w-4 " color={config ? '#161616' : '#FFFFFF'} />
          </Button>
          <OpenConfig />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {editingConfig ? (
          <DiffEditor
            theme="vs-dark"
            language="yaml"
            original={config && configYAML(config)}
            modified={editingConfig && configYAML(editingConfig)}
          />
        ) : (
          <Editor
            theme="vs-dark"
            wrapperProps={{ className: 'flex-1 flex-grow' }}
            language="yaml"
            value={config && configYAML(config)}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPane;
