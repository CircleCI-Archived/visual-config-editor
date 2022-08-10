import ExecutorIcon from '../../../../icons/components/ExecutorIcon';
import { NavigationComponent } from '../../../../state/Store';
import BreadCrumbs from '../../../containers/BreadCrumbs';
import { executorSubtypes } from '../../../containers/inspector/subtypes/ExecutorSubtypes';
import { SubTypeSelectPageProps } from '../../SubTypeMenu';
import Card from '../../../atoms/Card';
import NewWindowIcon from '../../../../icons/ui/NewWindowIcon';
import InfoIcon from '../../../../icons/ui/InfoIcon';

const ExecutorTypePage = (props: SubTypeSelectPageProps<string>) => {
  return (
    <div>
      <header>
        <BreadCrumbs />
        <div className="ml-6 flex py-3">
          <ExecutorIcon className="w-8 h-8 p-1 pl-0 mr-1"></ExecutorIcon>
          <h1 className="text-2xl font-bold">New Executor</h1>
        </div>
        <div className="flex border-b border-circle-gray-300 pl-6">
          <div
            className={`text-sm tracking-wide px-3 py-3 font-bold text-center border-b-4 border-black text-circle-black`}
          >
            TYPE
          </div>
        </div>
      </header>
      <div className="p-6">
        {Object.keys(executorSubtypes).map((subtype) => (
          <Card
            key={subtype}
            icon={<ExecutorIcon className="w-6 mr-2" type={subtype} />}
            description={executorSubtypes[subtype].description}
            title={executorSubtypes[subtype].text}
            onClick={() => {
              props.setSubtype(subtype);
            }}
            pinned={
              <div>
                {executorSubtypes[subtype].docsLink && (
                  <a
                    className="tracking-wide flex flex-row hover:underline leading-6 text-xs text-circle-blue font-thin"
                    href={executorSubtypes[subtype].docsLink}
                    target="circleci_docs"
                    aria-label={`Open ${subtype} documentation`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <NewWindowIcon className="w-4 my-auto" />
                  </a>
                )}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

const ExecutorTypePageNav: NavigationComponent = {
  Component: ExecutorTypePage,
  Label: (props: SubTypeSelectPageProps<string>) => <p>New Executor</p>,
  Icon: (props: SubTypeSelectPageProps<string>) => (
    <ExecutorIcon className="w-6 h-8 py-2" />
  ),
};

export default ExecutorTypePageNav;
