import algoliasearch from 'algoliasearch/lite';
import {
  Hits,
  HitsPerPage,
  InstantSearch,
  PaginationProps,
  SearchBox,
  usePagination,
} from 'react-instantsearch-hooks-web';
import { useStoreActions } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import Card from '../../atoms/Card';
import { Select } from '../../atoms/Select';
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

function Pagination(props: PaginationProps) {
  const { pages, refine } = usePagination(props);

  return (
    <div className="flex flex-row mx-auto">
      {pages.map((page) => (
        <button
          className="w-9 h-9 border border-circle-gray-300 mx-1 rounded hover:border-gray-700"
          key={page}
          onClick={() => {
            refine(page + 1);
          }}
        >
          {page + 1}
        </button>
      ))}
    </div>
  );
}

const OrbImportMenu = (props: InspectorDefinitionProps) => {
  const tabs = ['EXPLORE', 'IN PROJECT'];
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <div className="pl-6 pr-5 py-3 flex text-sm text-circle-gray-500">
          Make use of curated definitions from official or community orbs to
          speed up your pipeline building process.
        </div>
      </header>
      <TabbedMenu tabs={tabs} activeTab={props.activeTab || 0}>
        <div className="p-6">
          <InstantSearch searchClient={searchClient} indexName="orbs-prod">
            {/* <RefinementList attribute="brand" /> */}
            <p className="font-bold leading-5 tracking-wide">Search Filters</p>
            <Select className="mt-2 w-full">
              <option>Recommended Orbs</option>
            </Select>
            <SearchBox
              placeholder="Search Orb Directory..."
              classNames={{
                form: 'my-2 rounded border border-circle-gray-300 px-2 hover:border-circle-gray-700',
                input: 'p-2',
                submit: 'p-2',
              }}
            />
            <HitsPerPage
              hidden
              items={[{ value: 6, label: '', default: true }]}
            />
            <Hits
              className="overflow-y-auto"
              hitComponent={({ hit, sendEvent }) => {
                let values = hit as unknown as OrbDefinitionProps;

                return (
                  <Card
                    truncate={140}
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
            <div className="flex px-auto">
              <Pagination padding={2}></Pagination>
            </div>
          </InstantSearch>
        </div>
        <div></div>
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
