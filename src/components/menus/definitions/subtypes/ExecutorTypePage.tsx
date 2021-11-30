import ExecutorIcon from '../../../../icons/components/ExecutorIcon';
import { NavigationComponent } from '../../../../state/Store';
import BreadCrumbs from '../../../containers/BreadCrumbs';
import { executorSubtypes } from '../../../containers/inspector/subtypes/ExecutorSubtypes';
import { SubTypeSelectPageProps } from '../../SubTypeMenu';

const ExecutorTypePage = (props: SubTypeSelectPageProps<string>) => {
  return (
    <div>
      <header>
        {/* <WorkflowIcon className="w-6 h-6 mr-1" color="#6A6A6A" /> */}
        <BreadCrumbs />
        <div className="ml-6 flex py-3">
          <ExecutorIcon className="w-8 h-8 p-1 pl-0 mr-1"></ExecutorIcon>
          <h1 className="text-2xl font-bold">New Executor</h1>
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
        {Object.keys(executorSubtypes).map((subtype) => (
          <button
            key={subtype}
            type="button"
            className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
            onClick={() => {
              props.setSubtype(subtype);
            }}
          >
            <p className="font-bold">{executorSubtypes[subtype].text}</p>
            <p className="text-sm mt-1 leading-4 text-circle-gray-500">
              {executorSubtypes[subtype].description}
            </p>
          </button>
          // <InspectorProperty name={command} label={commandProps[command].text} as="card" />
        ))}
      </div>
    </div>
  );
};

const ExecutorTypePageNav: NavigationComponent = {
  Component: ExecutorTypePage,
  Label: (props: SubTypeSelectPageProps<string>) => <p>New Executor</p>,
  Icon: (props: SubTypeSelectPageProps<string>) => <ExecutorIcon className="w-6 h-8 py-2" />,
};

export default ExecutorTypePageNav;
