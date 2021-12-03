import { useStoreState } from '../../state/Hooks';

/**
 * @see
 * @returns
 */
const NavigationPane = () => {
  const navigation = useStoreState((state) => state.navigation);
  const NavPage = navigation.component.Component;

  return (
    <div className="h-full border-l border-circle-gray-300 w-80 pt-6 bg-white flex flex-col overflow-y-hidden">
      <NavPage {...navigation.props} />
    </div>
  );
};

export default NavigationPane;
