import * as CircleCI from '@circleci/circleci-config-sdk';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  OrbImport,
  OrbRef,
} from '@circleci/circleci-config-sdk/dist/src/lib/Orb';
import { useEffect, useState } from 'react';
import GenerableMapping, {
  typeToComponent,
} from '../../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import ComponentInfo from '../../atoms/ComponentInfo';
import Definition from '../../atoms/Definition';
import BreadCrumbs from '../../containers/BreadCrumbs';
import CollapsibleList from '../../containers/CollapsibleList';

export type OrbDefinitionProps = {
  name: string;
  namespace: string;
  version: string;
  logo_url: string;
  description: string;
  url: string;
};

const loadOrb = (orb: string) => {
  const endpoint =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3030'
      : 'https://temp-orb-manifest-endpoint.herokuapp.com';

  return fetch(`${endpoint}/orbs?orb=${orb}`).then((res) => res.json());
};

const orbDefinitions = ['jobs', 'commands', 'executors'] as Array<
  'jobs' | 'commands' | 'executors'
>;

const OrbDefinitionContainer = (props: {
  dataMapping: GenerableMapping;
  data: Record<string, OrbRef<AnyParameterLiteral>>;
}) => {
  return (
    <div className="p-4 pt-4 pb-0">
      <CollapsibleList expanded title={props.dataMapping.name.plural || ''}>
        <div className="p-2">
          <ComponentInfo type={props.dataMapping} />
          {Object.entries(props.data).map(([name, ref]) => (
            <Definition type={props.dataMapping} data={ref} index={-1} />
          ))}
        </div>
      </CollapsibleList>
      <div className="w-full p-2 border-b border-circle-gray-300"></div>
    </div>
  );
};

const OrbDefinitionsMenu = (props: OrbDefinitionProps) => {
  const definitions = useStoreState((state) => state.definitions);
  const importOrb = useStoreActions((actions) => actions.importOrb);
  const [orb, setOrb] = useState<OrbImport>();

  useEffect(() => {
    loadOrb(`${props.namespace}/${props.name}@${props.version}`).then(
      (manifest) => {
        setOrb(
          new CircleCI.orb.OrbImport(
            props.name,
            props.namespace,
            props.name,
            manifest,
            props.version,
          ),
        );
      },
    );
  }, [setOrb, props]);

  const inProject = definitions.orbs.find(
    (importedOrb) =>
      importedOrb.namespace === orb?.namespace && importedOrb.name === orb.name,
  );

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-circle-gray-300">
        <BreadCrumbs />
        <div className="px-6 p-3">
          <div className="flex flex-row">
            <h2 className="text-circle-gray-400">{props.version}</h2>
            <h2 className="flex ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium">
              Documentation
            </h2>
          </div>
          <div className="flex flex-row mt-3">
            <img className="w-8 h-8 mx-1" src={props.logo_url} alt="" />
            <h1 className="ml-2 text-xl font-thin text-circle-gray-500">
              {props.namespace}/
            </h1>
            <h1 className="text-xl">{props.name}</h1>
          </div>
          <p className="mr-5 py-3 flex text-sm text-circle-gray-400">
            {props.description}
          </p>
          {inProject ? (
            <button className="text-circle-black bg-gray-200 rounded p-2 w-full hover:border-circle-red hover:bg-red-200 border ">
              Imported
            </button>
          ) : (
            <button
              className="text-circle-black bg-gray-200 rounded p-2 w-full hover:border-gray-700 border"
              onClick={() => {
                if (orb) {
                  importOrb(orb);
                }
              }}
            >
              Import
            </button>
          )}
        </div>
      </header>
      {orb ? (
        <div className="p-2">
          {orbDefinitions.map((component) => {
            const mapping = typeToComponent(component);

            if (mapping) {
              return (
                <OrbDefinitionContainer
                  dataMapping={mapping.mapping}
                  data={orb[component]}
                />
              );
            }
            return <p>Error</p>;
          })}
        </div>
      ) : (
        <div> </div>
      )}
    </div>
  );
};

const OrbDefinitionMenuNav: NavigationComponent = {
  Component: OrbDefinitionsMenu,
  Label: (props: OrbDefinitionProps) => {
    return <p>{props.name}</p>;
  },
  Icon: (props: OrbDefinitionProps) => {
    return <img className="w-4 h-4 mx-1" src={props.logo_url} alt="" />;
  },
};

export { OrbDefinitionMenuNav, OrbDefinitionsMenu };
