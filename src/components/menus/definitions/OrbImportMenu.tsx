import algoliasearch from 'algoliasearch/lite';
import {
  Hits,
  HitsPerPage,
  InstantSearch,
  PaginationProps,
  useInstantSearch,
  usePagination,
  useSearchBox,
  UseSearchBoxProps,
} from 'react-instantsearch-hooks-web';
import DeleteItemIcon from '../../../icons/ui/DeleteItemIcon';
import Loading from '../../../icons/ui/Loading';
import { useStoreActions } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import { Button } from '../../atoms/Button';
import Card from '../../atoms/Card';
import { Footer } from '../../atoms/Footer';
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
  const { pages, refine, nbPages } = usePagination(props);
  const { results } = useInstantSearch();

  return (
    <>
      {results.hits.length > 0 && (
        <div className="flex flex-row px-2">
          <Button
            variant="secondary"
            margin="2"
            className="w-9 h-9 border border-circle-gray-300 mx-1 rounded-sm hover:border-gray-700"
            onClick={() => {
              refine(pages[0] - 1);
            }}
            disabled={pages[0] === 0}
          >
            {'<'}
          </Button>
          {pages.map((page) => (
            <Button
              variant="secondary"
              margin="2"
              className="w-9 h-9 border border-circle-gray-300 mx-1 px-0 rounded-sm hover:border-gray-700"
              key={page}
              onClick={() => {
                refine(page + 1);
              }}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            variant="secondary"
            margin="2"
            className="w-9 h-9 border border-circle-gray-300 mx-1 rounded-sm hover:border-gray-700"
            onClick={() => {
              refine(pages[pages.length - 1] + 1);
            }}
            disabled={pages[pages.length - 1] + 1 === nbPages}
          >
            {'>'}
          </Button>
        </div>
      )}
    </>
  );
}

const SearchBox = (
  props: UseSearchBoxProps & { className?: string; placeholder?: string },
) => {
  const { query, refine, clear } = useSearchBox(props);
  const { results } = useInstantSearch();

  return (
    <>
      <div
        aria-label="Orbs Search Box"
        className="my-2 rounded-sm border w-fullborder-circle-gray-300 hover:border-circle-gray-700 flex flex-row"
      >
        <input
          value={query}
          placeholder={props.placeholder}
          className="pl-4 p-2 m-0 flex-grow"
          onChange={(e) => refine(e.target.value)}
        />
        <button type="button" className="mx-4" onClick={() => clear()}>
          <DeleteItemIcon className="w-3 h-3" />
        </button>
      </div>
      {results.hits.length < 1 && <Loading className="flex m-auto mt-10" />}
    </>
  );
};

const OrbImportMenu = (props: InspectorDefinitionProps) => {
  const tabs = ['EXPLORE'];
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
            <SearchBox placeholder="Search Orb Directory..." />
            <HitsPerPage
              hidden
              items={[{ value: 6, label: '', default: true }]}
            />
            <Hits
              className="overflow-y-auto mt-4"
              style={{ height: 'calc(100vh - 420px)' }}
              hitComponent={({ hit }) => {
                let values = hit as unknown as OrbDefinitionProps;

                return (
                  <Card
                    truncate={120}
                    icon={
                      <div className="rounded-full bg-white shadow mr-2 mb-2 flex w-6 h-6 p-px">
                        <img
                          src={
                            (hit.logo_url as string) ||
                            'https://circleci.com/developer/orb-logos/community.png'
                          }
                          className="rounded-full my-auto bg-white"
                          alt={`${hit.name} logo` || 'Orb Logo'}
                        />
                      </div>
                    }
                    pinned={
                      <p className="bg-circle-gray-300 rounded-full text-xs p-px my-auto px-2">
                        {hit.version as string}
                      </p>
                    }
                    key={hit.full_name as string}
                    title={hit.name as string}
                    description={hit.description as string}
                    onClick={() => {
                      navigateTo({
                        component: OrbDefinitionMenuNav,
                        props: values,
                      });
                    }}
                  />
                );
              }}
            />

            <Footer centered>
              <Pagination padding={1}></Pagination>
            </Footer>
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
