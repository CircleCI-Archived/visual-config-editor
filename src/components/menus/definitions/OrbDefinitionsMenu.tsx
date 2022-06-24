import { NavigationComponent } from '../../../state/Store';
import BreadCrumbs from '../../containers/BreadCrumbs';

export type OrbDefinitionProps = {
  name: string;
  namespace: string;
  version: string;
  full_name: string;
  logo_url: string;
  description: string;
  url: string;
};
const OrbDefinitionsMenu = (props: OrbDefinitionProps) => {
  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-circle-gray-400">
        <BreadCrumbs />
        <div className="px-6 pt-3">
          <div className="flex flex-row">
            <h2 className="text-circle-gray-400">{props.version}</h2>
            <h2 className="flex ml-auto text-circle-blue font-bold">
              Documentation
            </h2>
          </div>
          <div className="flex flex-row mt-3">
            <img className="w-8 h-8 mx-1" src={props.logo_url} alt="" />
            <h1 className="ml-2 text-xl font-thin text-circle-gray-500">
              {props.namespace}/
            </h1>
            <h1 className="text-xl">{props.name}</h1>
          </div>
          <p className="mr-5 py-3 flex text-sm text-circle-gray-500">
            {props.description}
          </p>
        </div>
      </header>
      {/* <CollapsibleList>
        
        </CollasibleList> */}
    </div>
  );
};

const OrbDefinitionMenuNav: NavigationComponent = {
  Component: OrbDefinitionsMenu,
  Label: (props: OrbDefinitionProps) => {
    return <p>{props.name}</p>;
  },
  Icon: (props: OrbDefinitionProps) => {
    return <img className="w-4 h-4 mx-1" src={props.logo_url} alt="" />;
  },
};

export { OrbDefinitionMenuNav, OrbDefinitionsMenu };
