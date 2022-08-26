import { WorkflowJob } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import BranchIcon from '../../icons/ui/BranchIcon';
import EditIcon from '../../icons/ui/EditIcon';
import FilterIcon from '../../icons/ui/FilterIcon';
import TagIcon from '../../icons/ui/TagIcon';
import { useStoreActions } from '../../state/Hooks';
import { Empty } from '../atoms/Empty';
import StagedFilterMenuNav from '../menus/stage/StagedFilterMenu';
import CollapsibleList from './CollapsibleList';

const combineFilters = (filters: any, condition: 'ignore' | 'only') => {
  const branches = filters?.branches;
  const tags = filters?.tags;
  const branchesCon =
    branches && condition in branches ? branches[condition] : [];
  const tagsCon = tags && condition in tags ? tags[condition] : [];

  return { branches: branchesCon, tags: tagsCon };
};

export const FilterTargetList = ({
  values,
  target,
}: {
  values: string[];
  target: 'branches' | 'tags';
}) => {
  const Icon = target === 'branches' ? BranchIcon : TagIcon;

  return (
    <>
      {values?.map((value) => (
        <div
          className="w-full mt-2 pl-2 py-1 px-3
        bg-white border border-circle-gray-300 hover:border-circle-black rounded flex flex-row h-10"
        >
          <Icon className="w-3 ml-1 mr-2 my-auto" />
          <p className="flex-1 overflow-ellipsis overflow-hidden whitespace-nowrap">
            {value}
          </p>
        </div>
      ))}
    </>
  );
};

export const FilterConditionList = (props: {
  filters: any;
  condition: 'Ignore' | 'Only';
}) => {
  const type = props.condition.toLowerCase() as 'ignore' | 'only';
  const values = combineFilters(props.filters, type);

  return (
    <>
      {(values.branches?.length > 0 ||
        values.tags?.length > 0) && (
          <div className="pl-4 pt-1">
            <h3 className="text-sm font-medium">{props.condition}</h3>
            <FilterTargetList values={values.branches} target="branches" />
            <FilterTargetList values={values.tags} target="tags" />
          </div>
        )}
    </>
  );
};

export const FilterPreviewContainer = ({
  values,
  source,
}: {
  values: any;
  source: WorkflowJob;
}) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const filters = values.parameters?.filters;
  const tagSum =
    (filters?.tags?.only?.length || 0) + (filters?.tags?.ignore?.length || 0);
  const branchSum =
    (filters?.branches?.only?.length || 0) +
    (filters?.branches?.ignore?.length || 0);
  const filterSum = tagSum + branchSum;

  return (
    <CollapsibleList
      title={'Filters'}
      expanded
      titleFont="font-medium text-sm"
      className="mb-4"
      pinned={
        <button
          type="button"
          className={`bg-circle-gray-300 transition-colors h-8 w-8 rounded hover:bg-circle-gray-400 ml-auto`}
          onClick={() => {
            navigateTo({
              component: StagedFilterMenuNav,
              props: { source, values },
              values,
            });
          }}
        >
          <EditIcon className="m-auto w-4"></EditIcon>
        </button>
      }
    >
      {filterSum > 0 ? (
        <>
          <FilterConditionList filters={filters} condition="Only" />
          <FilterConditionList filters={filters} condition="Ignore" />
        </>
      ) : (
        <Empty
          label="No Filters Yet"
          Logo={FilterIcon}
          description="Edit filters by clicking the button above"
        />
      )}
    </CollapsibleList>
  );
};
