import * as CircleCI from '@circleci/circleci-config-sdk';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { OrbRef } from '@circleci/circleci-config-sdk/dist/src/lib/Orb';
import { OrbImportManifest } from '@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types';
import GenerableMapping, {
  typeToComponent,
} from '../../../mappings/ComponentMapping';
import { NavigationComponent } from '../../../state/Store';
import ComponentInfo from '../../atoms/ComponentInfo';
import Definition from '../../atoms/Definition';
import BreadCrumbs from '../../containers/BreadCrumbs';
import CollapsibleList from '../../containers/CollapsibleList';

export type OrbDefinitionProps = {
  name: string;
  namespace: string;
  version: string;
  full_name: string;
  logo_url: string;
  description: string;
  url: string;
};

const importManifest: OrbImportManifest = {
  jobs: {
    say_hello: {
      greeting: {
        type: 'string',
      },
    },
  },
  commands: {
    say_it: {
      what: {
        type: 'string',
      },
    },
  },
  executors: {
    python: {
      version: {
        type: 'string',
        default: '1.0.0',
      },
    },
  },
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
  const orbImport = new CircleCI.orb.OrbImport(
    props.name,
    props.namespace,
    props.name,
    importManifest,
    props.namespace,
  );

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-circle-gray-300">
        <BreadCrumbs />
        <div className="px-6 pt-3">
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
        </div>
      </header>
      <div className="p-2">
        {orbDefinitions.map((component) => {
          const mapping = typeToComponent(component);

          if (mapping) {
            return (
              <OrbDefinitionContainer
                dataMapping={mapping.mapping}
                data={orbImport[component]}
              />
            );
          }
          return <p>Error</p>;
        })}
      </div>
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
