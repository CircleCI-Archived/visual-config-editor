import Collapsible from 'react-collapsible';
import ComponentMapping from '../../mappings/ComponentMapping';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import Definition from '../atoms/Definition';

export interface DefintionsProps {
  type: ComponentMapping;
}

const DefintionsContainer = (props: DefintionsProps) => {
  const getIcon = () => {
    let iconComponent = props.type.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className="ml-1 mr-3 w-8 h-8" />;
    }
  };

  const items = useStoreState(props.type.store.get);
  const inspect = useStoreActions((actions) => actions.inspect);

  return (
    <div className="mb-4">
      <Collapsible
        triggerClassName="text-circle-black shadow-md text-2xl hover:bg-circle-gray-100 p-2 block border border-circle-gray-300 bg-white duration:50 transition-all w-full rounded-md"
        triggerOpenedClassName="block border border-circle-gray-300 text-2xl p-2 shadow-md text-circle-black bg-white w-full transition rounded-t-md"
        transitionTime={50}
        trigger={
          <div className="flex ">
            {getIcon()}
            <p className="self-center">{props.type.name.plural}</p>
          </div>
        }
      >
        {items?.map((item) => (
          <div className="w-full p-2 bg-circle-gray-200" key={item.name}>
            <Definition data={item} type={props.type} />
          </div>
        ))}
        <div className="w-full p-2">
          <button
            onClick={() => inspect({ dataType: props.type, mode: 'creating' })}
            className="p-1 w-full rounded-md text-white text-xl transition-colors hover:bg-circle-blue-light bg-circle-blue"
          >
            Create {props.type.name.singular}
          </button>
        </div>
      </Collapsible>
    </div>
  );
};

export default DefintionsContainer;
