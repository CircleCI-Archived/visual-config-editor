import { parsers } from '@circleci/circleci-config-sdk';
import { OrbImportManifest } from '@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types';
import { useRef } from 'react';
import { parse } from 'yaml';
import OpenIcon from '../../icons/ui/OpenIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { Button } from '../atoms/Button';
import { loadOrb } from '../menus/definitions/OrbDefinitionsMenu';

export const OpenConfig = () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const config = useStoreState((state) => state.config);
  const loadConfig = useStoreActions((actions) => actions.loadConfig);

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

          const setConfig = (
            yml: string,
            orbImports?: Record<string, OrbImportManifest>,
          ) => {
            let parseResult;
            try {
              parseResult = {
                config: parsers.parseConfig(yml, orbImports),
                manifests: orbImports,
              };
            } catch (e) {
              parseResult = e as Error;
            }
            loadConfig(parseResult);
          };

          e.target.files[0].text().then((yml) => {
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
                    throw new Error(`Could not parse orb ${alias}`);
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
                        throw new Error(`Could not load orb ${orb}`);
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
          });
        }}
      />
      <Button
        title='Open config.yml file'
        ariaLabel='Open config.yml file'
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
