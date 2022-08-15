import { orb } from '@circleci/circleci-config-sdk';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  OrbImport,
  OrbRef,
} from '@circleci/circleci-config-sdk/dist/src/lib/Orb';
import {
  OrbDisplayMeta,
  OrbImportManifest,
} from '@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types';
import { useEffect, useState } from 'react';
import Loading from '../../../icons/ui/Loading';
import { typeToMapping } from '../../../mappings/GenerableMapping';
import InspectableMapping from '../../../mappings/InspectableMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import { Button } from '../../atoms/Button';
import ComponentInfo from '../../atoms/ComponentInfo';
import Definition from '../../atoms/Definition';
import { Footer } from '../../atoms/Footer';
import BreadCrumbs from '../../containers/BreadCrumbs';
import CollapsibleList from '../../containers/CollapsibleList';

export class OrbImportWithMeta extends orb.OrbImport {
  logo_url: string;

  constructor(
    alias: string,
    namespace: string,
    orb: string,
    manifest: OrbImportManifest,
    version: string,
    logo_url: string,
    description?: string,
    display?: OrbDisplayMeta,
  ) {
    super(alias, namespace, orb, version, manifest, description, display);

    this.logo_url = logo_url;
  }
}

export type OrbDefinitionProps = {
  name: string;
  namespace: string;
  version: string;
  logo_url: string;
  display: OrbDisplayMeta;
  description: string;
  url: string;
};

export const loadOrb = (orb: string, value?: OrbImport) => {
  const endpoint =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3030'
      : 'https://temp-orb-manifest-endpoint.herokuapp.com';

  return fetch(`${endpoint}/orbs?orb=${orb}`).then(
    (resp) =>
      new Promise<{ orb: string | OrbImport; manifest: OrbImportManifest }>(
        (res, rej) => {
          resp
            .json()
            .then((manifest) => {
              res({
                orb: value ?? orb,
                manifest,
              });
            })
            .catch((err) => {
              rej(err);
            });
        },
      ),
  );
};

const orbDefinitions = ['jobs', 'commands', 'executors'] as Array<
  'jobs' | 'commands' | 'executors'
>;

const OrbDefinitionContainer = (props: {
  dataMapping: InspectableMapping;
  data: Record<string, OrbRef<AnyParameterLiteral>>;
}) => {
  return Object.values(props.data).length > 0 ? (
    <>
      <CollapsibleList
        expanded
        className="py-4"
        classNameExpanded="py-4"
        title={props.dataMapping.name.plural || ''}
      >
        <>
          <div className="p-2">
            <ComponentInfo type={props.dataMapping} />
          </div>
          {Object.entries(props.data).map(([name, ref]) => (
            <Definition key={name} type={props.dataMapping} data={ref} index={-1} />
          ))}
        </>
      </CollapsibleList>
      <span className="flex w-full border-b border-circle-gray-300"></span>
    </>
  ) : (
    <></>
  );
};

const OrbDefinitionsMenu = (props: OrbDefinitionProps) => {
  const orbs = useStoreState((state) => state.definitions.orbs);
  const importOrb = useStoreActions((actions) => actions.importOrb);
  const [orb, setOrb] = useState<OrbImportWithMeta>();

  useEffect(() => {
    loadOrb(`${props.namespace}/${props.name}@${props.version}`).then(
      ({ manifest }) => {
        setOrb(
          new OrbImportWithMeta(
            props.name,
            props.namespace,
            props.name,
            manifest,
            props.version,
            props.logo_url,
            props.description,
          ),
        );
      },
    );
  }, [setOrb, props]);

  const inProject = Object.values(orbs).find(
    (importedOrb) =>
      importedOrb.value.namespace === orb?.namespace &&
      importedOrb.value.name === orb.name,
  );

  return (
    <div aria-label="Orbs Defintion Menu" className="h-full flex flex-col">
      <header className="border-b border-circle-gray-300">
        <BreadCrumbs />
        <div className="px-6 p-3">
          <div className="flex flex-row">
            <h2 className="text-circle-gray-400">{props.version}</h2>
            <a
              className="flex ml-auto cursor-pointer tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
              href={orb?.display?.source_url}
              target="circleci_docs"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              View on Dev Hub
            </a>
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
        </div>
      </header>
      {orb ? (
        <div className="px-2 h-full flex flex-col">
          <div
            className="flex flex-col overflow-y-scroll h-auto px-4"
            style={{ height: `calc(100vh - 321px)` }}
          >
            {orbDefinitions.map((component) => {
              const mapping = typeToMapping(component);

              if (mapping) {
                return (
                  <OrbDefinitionContainer
                    key={component}
                    dataMapping={mapping.mapping}
                    data={orb[component]}
                  />
                );
              }
              return <p>Error</p>;
            })}
          </div>
          <Footer>
            {inProject ? (
              <Button variant="dangerous">Remove Orb from Config</Button>
            ) : (
              <Button
                onClick={() => {
                  if (orb) {
                    importOrb(orb);
                  }
                }}
                variant="primary"
              >
                Import Orb
              </Button>
            )}
          </Footer>
        </div>
      ) : (
        <div className="flex m-auto">
          <Loading />
        </div>
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
