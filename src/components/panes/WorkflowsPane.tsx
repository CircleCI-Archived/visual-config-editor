import { parsers } from '@circleci/circleci-config-sdk';
import { OrbImport } from '@circleci/circleci-config-sdk/dist/src/lib/Orb';
import { useRef } from 'react';
import Logo from '../../icons/ui/Logo';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { Button } from '../atoms/Button';
import WorkflowPane from '../containers/WorkflowContainer';
import {
  loadOrb,
  OrbImportWithMeta,
} from '../menus/definitions/OrbDefinitionsMenu';
import { parse } from 'yaml';

const WorkflowsPane = () => {
  const workflows = useStoreState((state) => state.definitions.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);

  const inputFile = useRef<HTMLInputElement>(null);
  const config = useStoreState((state) => state.config);
  const loadConfig = useStoreActions((actions) => actions.loadConfig);

  return (
    <div
      arial-label="Workflows Pane"
      className="flex flex-col flex-nowrap flex-1"
    >
      <header className="flex w-full bg-white h-16">
        <div className="p-2 flex flex-row my-auto w-full">
          <div className="my-auto flex flex-row">
            <Logo className="mx-2" />
            <h1 className="text-xl font-bold">Visual Config Editor</h1>
          </div>
          <input
            type="file"
            accept=".yml,.yaml"
            ref={inputFile}
            className="hidden"
            onChange={(e) => {
              if (!e.target.files) {
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
                      loadOrb(
                        `${orb.namespace}/${orb.name}@${orb.version}`,
                        orb,
                      ),
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
                            orb.description,
                          ),
                        };
                      }),
                    );

                    setConfig(yml, orbImports);
                  });
                }
              });
            }}
          />
          <Button
            variant={config ? 'secondary' : 'primary'}
            className="w-min whitespace-nowrap flex ml-auto"
            onClick={(e) => {
              inputFile.current?.click();
              e.stopPropagation();
            }}
          >
            Open Config
          </Button>
        </div>
      </header>

      <WorkflowPane
        workflow={workflows[selectedWorkflow].value}
        bgClassName="bg-circle-gray-200"
        className="border border-r-0 h-full border-b-0 border-circle-gray-300"
      />
    </div>
  );
};

export default WorkflowsPane;
