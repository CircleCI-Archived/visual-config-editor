import { createTypedHooks } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { StoreActions, StoreModel } from './Store';

import { parse } from 'yaml';
import { OrbImportManifest } from '@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types';
import { Config, parsers } from '@circleci/circleci-config-sdk';
import { loadOrb } from '../components/menus/definitions/OrbDefinitionsMenu';
const typedHooks = createTypedHooks<StoreModel & StoreActions>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
export type CallbackResponse =
  | {
      config: Config;
      manifests: Record<string, OrbImportManifest> | undefined;
    }
  | Error;

export const parseConfigHook = (
  yml: string,
  callback: (res: CallbackResponse) => void,
) => {
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
    callback(parseResult);
  };

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
      const orbImports: Record<string, OrbImportManifest> = Object.assign(
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
};

export const useConfigParser = () => {
  return parseConfigHook;
};
