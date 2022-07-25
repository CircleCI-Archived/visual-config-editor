import ParameterIcon from '../../../../icons/components/ParameterIcon';
import InspectableMapping from '../../../../mappings/InspectableMapping';
import { NavigationComponent } from '../../../../state/Store';
import Card from '../../../atoms/Card';
import BreadCrumbs from '../../../containers/BreadCrumbs';
import {
  componentParametersSubtypes,
  parameterSubtypes,
} from '../../../containers/inspector/subtypes/ParameterSubtypes';
import { SubTypeSelectPageProps } from '../../SubTypeMenu';

const ParameterTypePage = (
  props: SubTypeSelectPageProps<string> & { component: InspectableMapping },
) => {
  const parameters =
    props.component?.parameters || componentParametersSubtypes.pipeline;

  return (
    <div>
      <header>
        {/* <WorkflowIcon className="w-6 h-6 mr-1" color="#6A6A6A" /> */}
        <BreadCrumbs />
        <div className="ml-6 flex py-3">
          <ParameterIcon className="w-8 h-8 p-1 pl-0 mr-1"></ParameterIcon>
          <h1 className="text-2xl font-bold">New Parameter</h1>
        </div>
        <div className="flex border-b border-circle-gray-300 pl-6">
          <div
            className={`text-sm tracking-wide px-3 py-3 font-bold text-center 'border-black border-b-4 border-black text-circle-black`}
          >
            TYPE
          </div>
        </div>
      </header>
      <div className="p-6">
        {parameters?.types &&
          parameters.types.map((subtype: any) => (
            <Card
              key={subtype}
              description={parameterSubtypes[subtype].description}
              title={parameterSubtypes[subtype].text}
              onClick={() => {
                props.setSubtype(subtype);
              }}
              pinned={
                <div>
                  {parameterSubtypes[subtype].docsLink && (
                    <a
                      className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
                      href={parameterSubtypes[subtype].docsLink}
                      target="circleci_docs"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Learn More
                    </a>
                  )}
                </div>
              }
            />
            // <InspectorProperty name={command} label={commandProps[command].text} as="card" />
          ))}
      </div>
    </div>
  );
};

const ParameterTypePageNav: NavigationComponent = {
  Component: ParameterTypePage,
  Label: (props: SubTypeSelectPageProps<string>) => <p>New Parameter</p>,
  Icon: (props: SubTypeSelectPageProps<string>) => (
    <ParameterIcon className="w-6 h-8 py-2" />
  ),
};

export default ParameterTypePageNav;
