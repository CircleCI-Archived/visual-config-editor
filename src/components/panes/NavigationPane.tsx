import { useStoreState } from '../../state/Hooks';

/**
 * @see
 * @returns
 */
const NavigationPane = () => {
  const navigation = useStoreState((state) => state.navigation);
  const curStop = navigation.path[navigation.path.length - 1];
  const NavPage = curStop.component;

  return (
    <div className="h-full border-l border-circle-gray-300 w-80 pt-6 bg-white flex flex-col overflow-y-auto">
      <NavPage {...curStop.props} />
    </div>
  );
};

export default NavigationPane;
