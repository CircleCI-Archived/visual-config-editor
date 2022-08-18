import { parsers } from '@circleci/circleci-config-sdk';
import { OrbImport } from '@circleci/circleci-config-sdk/dist/src/lib/Orb';
import { useRef } from 'react';
import { parse } from 'yaml';
import OpenIcon from '../../icons/ui/OpenIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { Button } from '../atoms/Button';
import {
  loadOrb,
  OrbImportWithMeta,
} from '../menus/definitions/OrbDefinitionsMenu';

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
            orbImports?: Record<string, OrbImport>,
          ) => {
            let config;
            try {
              config = parsers.parseConfig(yml, orbImports);
            } catch (e) {
              config = e as Error;
            }
            loadConfig(config);
          };

          e.target.files[0].text().then((yml) => {
            const configBlob = parse(yml);

            if ('orbs' in configBlob) {
              const orbs = parsers.parseOrbImports(configBlob.orbs);

              if (!orbs) {
                setConfig(yml);
                return;
              }

              Promise.all(
                // get a sneak of the orb imports so we can load the manifests
                orbs.map((orb) =>
                  loadOrb(`${orb.namespace}/${orb.name}@${orb.version}`, orb),
                ),
              ).then((manifests) => {
                const orbImports = Object.assign(
                  {},
                  ...manifests.map(({ orb, manifest }) => {
                    if (typeof orb === 'string') {
                      throw new Error(`Could not load orb ${orb}`);
                    }

                    return {
                      [orb.alias]: new OrbImportWithMeta(
                        orb.alias,
                        orb.namespace,
                        orb.name,
                        manifest,
                        orb.version,
                        '',
                        '', // TODO: implement refetching of url
                        orb.description,
                      ),
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
        variant={config ? 'secondary' : 'primary'}
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
