import BreadCrumbArrowIcon from '../../icons/ui/BreadCrumbArrowIcon';
import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { commandSubtypes } from '../containers/inspector/subtypes/CommandSubtypes';
import StepPropertiesMenu from './StepPropertiesMenu';
import TabbedMenu from './TabbedMenu';

const StepTypeMenu = (props: { dataType: ComponentMapping }) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const navigation = useStoreState((state) => state.navigation);

  const getIcon = (mapping: ComponentMapping, className: string) => {
    let iconComponent = mapping?.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className={className} />;
    }
  };

  return (
    <div>
      <header className="ml-6 ">
        {/* <WorkflowIcon className="w-6 h-6 mr-1" color="#6A6A6A" /> */}
        <nav className="flex items-center">
          <button
            className="text-base text-circle-gray-500"
            type="button"
            onClick={() => {
              navigateBack({ distance: 2 });
            }}
          >
            Definitions
          </button>
          <BreadCrumbArrowIcon className="pl-1 w-5 h-5" color="#6A6A6A" />
          {props.dataType && getIcon(props.dataType, 'w-6 h-8 py-2')}
          <button
            className="ml-1 font-medium leading-8 tracking-tight text-circle-gray-500"
            type="button"
            onClick={() => {
              navigateBack();
            }}
          >
            New {navigation.from?.props.dataType?.name.singular}
          </button>
          <BreadCrumbArrowIcon className="pl-1 w-5 h-5" color="#6A6A6A" />
          <p className="ml-1 font-medium leading-8 tracking-tight">New Step</p>
        </nav>
        <h1 className="text-2xl py-2 font-bold">Step Type</h1>
      </header>
      <TabbedMenu tabs={['BUILT-IN', 'COMMANDS', 'ORBS']}>
        <div className="p-6">
          {Object.keys(commandSubtypes).map((subtype) => (
            <button
              key={subtype}
              type="button"
              className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
              onClick={() => {
                navigateTo({ component: StepPropertiesMenu, props: { subtype } })
              }}
            >
              <p className="font-bold">{commandSubtypes[subtype].text}</p>
              <p className="text-sm mt-1 leading-4 text-circle-gray-500">
                {commandSubtypes[subtype].description}
              </p>
            </button>
            // <InspectorProperty name={command} label={commandProps[command].text} as="card" />
          ))}
        </div>
        <div>User defined commands will show here</div>
        <div>Predefined orb steps will show here</div>
      </TabbedMenu>
    </div>
  );
};

export default StepTypeMenu;
