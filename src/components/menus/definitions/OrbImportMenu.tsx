import algoliasearch from 'algoliasearch/lite';
import { Hits, InstantSearch, SearchBox } from 'react-instantsearch-hooks-web';
import { useStoreActions } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import Card from '../../atoms/Card';
import Select from '../../atoms/Select';
import BreadCrumbs from '../../containers/BreadCrumbs';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';
import { OrbDefinitionMenuNav, OrbDefinitionProps } from './OrbDefinitionsMenu';

type InspectorDefinitionProps = DataModel & {
  values: Record<string, object>;
  editing?: boolean;
  passBackKey?: string;
  activeTab?: number;
} & SubTypeMenuPageProps<any>;

const searchClient = algoliasearch(
  'U0RXNGRK45',
  '798b0e1407310a2b54b566250592b3fd',
);

const OrbImportMenu = (props: InspectorDefinitionProps) => {
  const tabs = ['EXPLORE', 'IN PROJECT'];
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

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
          <InstantSearch searchClient={searchClient} indexName="orbs-prod">
            {/* <RefinementList attribute="brand" /> */}
            <SearchBox
              placeholder="Search Orb Directory..."
              classNames={{
                form: 'my-4 rounded border border-circle-gray-400 px-2 hover:border-circle-gray-700',
                input: 'p-2',
                submit: 'p-2',
              }}
            />
            <Hits
              className="overflow-y-auto"
              hitComponent={({ hit, sendEvent }) => {
                let values = hit as unknown as OrbDefinitionProps;

                return (
                  <Card
                    icon={
                      <img
                        src={
                          (hit.logo_url as string) ||
                          'https://circleci.com/developer/orb-logos/community.png'
                        }
                        className="w-6 h-6 mr-2 mb-2"
                        alt=""
                      ></img>
                    }
                    pinned={
                      <p className="text-circle-gray-400 text-sm">
                        {hit.version as string}
                      </p>
                    }
                    key={hit.full_name as string}
                    title={hit.name as string}
                    description={hit.description as string}
                    onClick={() => {
                      navigateTo({
                        component: OrbDefinitionMenuNav,
                        props: {
                          name: values.name,
                          namespace: values.namespace,
                          version: values.version,
                          full_name: values.full_name,
                          logo_url: values.logo_url,
                          description: values.description,
                          url: values.url,
                        },
                      });
                    }}
                  />
                );
              }}
            />
          </InstantSearch>
        </div>
      </TabbedMenu>
    </div>
  );
};

const OrbImportMenuNav: NavigationComponent = {
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

export { OrbImportMenuNav, OrbImportMenu };
