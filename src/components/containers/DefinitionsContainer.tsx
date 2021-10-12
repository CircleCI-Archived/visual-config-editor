
import Collapsible from 'react-collapsible';
import ConfigData from '../../data/ConfigData';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import Definition from '../atoms/Definition';
import CreateNew from './CreateNew';

export interface DefintionsProps {
  type: ConfigData;
}

const Defintions = (props: DefintionsProps) => {
  const getIcon = () => {
    let iconComponent = props.type.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className="ml-1 mr-3 w-8 h-8" />
    }
  }

  const items = useStoreState(props.type.store.get);
  const inspect = useStoreActions((actions) => actions.inspect)

  return (
    <div className="mb-6">
      <Collapsible triggerClassName="text-gray-100 text-2xl hover:bg-circle-gray-600 p-2 block bg-circle-gray-800 duration:50 transition-all w-full rounded-lg"
        triggerOpenedClassName="block text-2xl p-2 text-gray-100 bg-circle-green w-full transition rounded-t-lg" transitionTime={50} trigger={
          <div className="flex ">
            {getIcon()}
            <p className="self-center">
              {props.type.name.plural}
            </p>
          </div>
        }
      >
        {
          items?.map((item) =>
            <div className="w-full p-2 bg-circle-gray-200" key={item.name}>
              <Definition data={item} type={props.type} />
            </div>)
        }
        <div className="w-full flex-inline h-15 p-2 rounded-b-lg bg-circle-gray-200 float-left">
          <button onClick={() => inspect({ dataType: props.type, mode: 'creating' })} className="pl-2 pr-2 rounded-full float-right text-white font-semibold text-xl transition-colors hover:bg-circle-blue-light bg-circle-blue">
            +
          </button>
        </div>
      </Collapsible>
    </div>
  );
};

export default Defintions;