import { FocusScope } from 'react-aria';
import { inspectorWidth } from '../../App';
import { useStoreState } from '../../state/Hooks';

interface NavigationPaneProps {
  width: number;
}

/**
 * @see
 * @returns
 */
const NavigationPane = (props: any, { width }: NavigationPaneProps) => {
  const navigation = useStoreState((state) => state.navigation);
  const NavPage = navigation.component.Component;

  return (
    <FocusScope contain={false}>
      <div
        ref={props.navigationPane}
        aria-label="Navigation Pane"
        className="h-full border-l border-circle-gray-300 pt-6 bg-white flex flex-col overflow-y-hidden"
        style={{ width: inspectorWidth }}
        id="Navigation-Pane"
      >
        <NavPage {...navigation.props} />
      </div>
    </FocusScope>
  );
};

export default NavigationPane;
