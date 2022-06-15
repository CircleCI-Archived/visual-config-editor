import { useStoreState } from '../../state/Hooks';

interface NavigationPaneProps {
  width: number;
}

/**
 * @see
 * @returns
 */
const NavigationPane = ({ width }: NavigationPaneProps) => {
  const navigation = useStoreState((state) => state.navigation);
  const NavPage = navigation.component.Component;

  return (
    <div
      className="h-full border-l border-circle-gray-300 pt-6 bg-white flex flex-col overflow-y-hidden"
      style={{ width }}
    >
      <NavPage {...navigation.props} />
    </div>
  );
};

export default NavigationPane;
