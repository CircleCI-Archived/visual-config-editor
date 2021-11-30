import { ReactElement } from 'react';
import BreadCrumbArrowIcon from '../../icons/ui/BreadCrumbArrowIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { NavigationModel } from '../../state/Store';

const BreadCrumbs = () => {
  const navigation = useStoreState((state) => state.navigation);
  const navigateBack = useStoreActions((actions) => actions.navigateBack);

  let components: ReactElement[] = [];
  let navAt: NavigationModel | undefined = navigation;
  let depth = 0;

  do {
    const curDepth = depth;
    if (depth > 0) {
      
      components.push(
        <BreadCrumbArrowIcon
          className="pl-1 w-5 h-5"
          key={`breadcrumb-${curDepth}-arrow`}
          color="#6A6A6A"
        />,
      );
    }

    components.push(
      <button
        className={
          curDepth === 0
            ? 'font-medium text-black ml-1 cursor-default'
            : 'text-circle-gray-500 hover:underline hover:text-black '
        }
        key={`breadcrumb-${curDepth}-link`}
        onClick={() => {
          curDepth > 0 && navigateBack({ distance: curDepth });
        }}
      >
        {curDepth > 1 ? '...' : navAt.component.Label(navAt.props)}
      </button>,
    );

    if (navAt.component.Icon) {
      const Icon = navAt.component.Icon(navAt.props);
      Icon &&
        components.push(<div key={`breadcrumb-${curDepth}-icon`}>{Icon}</div>);
    }

    depth++;
    navAt = navAt.from;
  } while (navAt !== undefined);

  components.reverse();

  return (
    <nav className="px-6">
      <div className="flex items-center">
        {components.map((component) => component)}
      </div>
    </nav>
  );
};

export default BreadCrumbs;
