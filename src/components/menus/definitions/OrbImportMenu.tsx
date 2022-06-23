import * as CircleCI from '@circleci/circleci-config-sdk';
import { OrbImportManifest } from '@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types';
import { useStoreActions } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import Card from '../../atoms/Card';
import Select from '../../atoms/Select';
import BreadCrumbs from '../../containers/BreadCrumbs';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';

type InspectorDefinitionProps = DataModel & {
  values: Record<string, object>;
  editing?: boolean;
  passBackKey?: string;
  activeTab?: number;
} & SubTypeMenuPageProps<any>;

let orbManifests: Array<
  {
    namespace: string;
    name: string;
    version: string;
    description: string;
  } & OrbImportManifest
> = [
  {
    name: 'my-orb',
    namespace: 'testing',
    version: '1.2.3',
    description: 'An orb that is hardcoded and for development purposes',
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
  },
];

const OrbImportMenu = (props: InspectorDefinitionProps) => {
  const tabs = ['EXPLORE', 'IN PROJECT'];
  const importOrb = useStoreActions((actions) => actions.importOrb);

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <div className="ml-6 mr-5 py-3 flex text-sm text-circle-gray-500">
          Make use of curated definitions from official or community orbs to
          speed up your pipeline building process.
        </div>
      </header>
      <TabbedMenu tabs={tabs} activeTab={props.activeTab || 0}>
        <div className="m-6">
          <p className="font-bold leading-5 tracking-wide">Search Filters</p>
          <Select className="mt-2 w-full">
            <option>Recommended Orbs</option>
          </Select>
          <input
            className="rounded border w-full border-circle-gray-400 pl-4 my-4 p-2 hover:border-circle-gray-700 "
            placeholder="Search orb directory..."
          />
          {orbManifests.map((importingOrb) => {
            let { name, namespace, description, version, ...manifest } =
              importingOrb;

            return (
              <Card
                title={importingOrb.name}
                description={importingOrb.description}
                onClick={() => {
                  importOrb(
                    new CircleCI.orb.OrbImport(
                      name,
                      namespace,
                      name,
                      manifest,
                      version,
                      description,
                    ),
                  );
                }}
              ></Card>
            );
          })}
        </div>
      </TabbedMenu>
    </div>
  );
};

const OrbDefinitionMenuNav: NavigationComponent = {
  Component: OrbImportMenu,
  Label: (props: InspectorDefinitionProps) => {
    return <p>Orbs</p>;
  },
  Icon: (props: InspectorDefinitionProps) => {
    let iconComponent = props.dataType?.components.icon;

    if (!iconComponent) {
      return null;
    }

    let DefinitionIcon = iconComponent;

    return <DefinitionIcon className="w-6 h-8 py-2" />;
  },
};

export { OrbDefinitionMenuNav, OrbImportMenu };
