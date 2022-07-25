import { inspectorWidth } from '../../App';
import { useStoreState } from '../../state/Hooks';
import Toast from '../atoms/Toast';

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
      <div
        className="p-6 absolute bottom-0 right-0 my-20 pointer-events-none"
        style={{ width: inspectorWidth }}
      >
        <Toast />
      </div>
    </div>
  );
};

export default NavigationPane;
