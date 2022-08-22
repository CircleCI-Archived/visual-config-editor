import { useRef } from 'react';
import OpenIcon from '../../icons/ui/OpenIcon';
import {
  useConfigParser,
  useStoreActions,
  useStoreState,
} from '../../state/Hooks';
import { Button } from '../atoms/Button';

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
<<<<<<< HEAD
            const configBlob = parse(yml);

            if ('orbs' in configBlob) {
              if (!configBlob.orbs) {
                setConfig(yml);
                return;
              }

              const orbPromises = Object.entries(configBlob.orbs).map(
                ([alias, stanza]) => {
                  const parsedOrb = parsers.parseOrbImport({ [alias]: stanza });

                  if (!parsedOrb) {
                    const parseError = new Error(
                      `Could not parse orb ${alias}`,
                    );

                    loadConfig(parseError);
                    throw parseError;
                  }

                  return loadOrb(stanza as string, parsedOrb, alias);
                },
              );

              Promise.all(orbPromises).then((loadedOrbs) => {
                const orbImports: Record<string, OrbImportManifest> =
                  Object.assign(
                    {},
                    ...loadedOrbs.map(({ orb, manifest, alias }) => {
                      if (!alias) {
                        const parseError = new Error(
                          `Could not parse orb ${orb}, no alias`,
                        );

                        loadConfig(parseError);
                        throw parseError;
                      }

                      return {
                        [alias]: manifest,
                      };
                    }),
                  );

                setConfig(yml, orbImports);
              });
            } else {
              setConfig(yml);
            }
=======
            parseConfig(yml, loadConfig);
>>>>>>> 5bab370... feat: added loadable config from query
          });
        }}
      />
      <Button
        variant={config ? 'secondary' : 'primary'}
        margin="2"
        className="w-10 whitespace-nowrap flex ml-auto"
        onClick={(e) => {
          inputFile.current?.click();
          e.stopPropagation();
        }}
      >
        <OpenIcon className="w-5" color={config ? '#161616' : '#FFFFFF'} />
      </Button>
    </>
  );
};
