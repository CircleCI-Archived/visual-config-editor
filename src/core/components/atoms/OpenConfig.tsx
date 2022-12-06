import { useRef } from 'react';
import OpenIcon from '../../icons/ui/OpenIcon';
import {
  useConfigParser,
  useStoreActions,
  useStoreState,
} from '../../state/Hooks';
import { Button } from './Button';

export const OpenConfig = () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const config = useStoreState((state) => state.config);
  const loadConfig = useStoreActions((actions) => actions.loadConfig);
  const parseConfig = useConfigParser();

  return (
    <>
      <input
        type="file"
        accept=".yml,.yaml"
        ref={inputFile}
        className="hidden"
        onChange={(e) => {
          if (!e.target.files) {
            console.error('File upload failed');
            return;
          }

          e.target.files[0].text().then((yml) => {
            parseConfig(yml, loadConfig);
          });
        }}
      />
      <Button
        variant={config ? 'secondary' : 'primary'}
        margin="2"
        className="w-12 h-8 whitespace-nowrap flex ml-auto"
        onClick={(e) => {
          inputFile.current?.click();
          e.stopPropagation();
        }}
      >
        <OpenIcon className="w-6" color={config ? '#161616' : '#FFFFFF'} />
      </Button>
    </>
  );
};
