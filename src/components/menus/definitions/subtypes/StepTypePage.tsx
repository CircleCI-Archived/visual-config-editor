import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Reusable';
import { useStoreState } from '../../../../state/Hooks';
import { NavigationComponent } from '../../../../state/Store';
import BreadCrumbs from '../../../containers/BreadCrumbs';
import { commandSubtypes } from '../../../containers/inspector/subtypes/CommandSubtypes';
import TabbedMenu from '../../TabbedMenu';
import { SubTypeSelectPageProps } from '../../SubTypeMenu';
import { mapDefinitions } from '../../../../state/DefinitionStore';
import { reusable } from '@circleci/circleci-config-sdk';
import Card from '../../../atoms/Card';

const StepTypePage = (
  props: SubTypeSelectPageProps<string | CustomCommand>,
) => {
  const definitions = useStoreState((state) => state.definitions);

  return (
    <div>
      <header>
        {/* <WorkflowIcon className="w-6 h-6 mr-1" color="#6A6A6A" /> */}
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-3 font-bold">Step Type</h1>
      </header>
      <TabbedMenu tabs={['BUILT-IN', 'COMMANDS', 'ORBS']}>
        <div className="p-6">
          {Object.entries(commandSubtypes).map(([name, subtype]) => (
            <Card
              key={name}
              description={subtype.description}
              title={subtype.name}
              onClick={() => {
                props.setSubtype(name);
              }}
              pinned={
                <div>
                  {subtype.docsLink && (
                    <a
                      className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
                      href={subtype.docsLink}
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
          ))}
        </div>
        <div className="p-6">
          {mapDefinitions<reusable.CustomCommand>(
            definitions.commands,
            (command) => (
              <button
                key={command.name}
                type="button"
                className="p-4 mb-4 w-full border-circle-gray-300 border hover:border-circle-black rounded text-left"
                onClick={() => {
                  props.setSubtype(command);
                }}
              >
                <p className="font-bold">{command.name}</p>
                <p className="text-sm mt-1 leading-4 text-circle-gray-500">
                  Command description will show here
                </p>
              </button>
            ),
          )}
        </div>
        <div>User defined commands will show here</div>
        <div>Predefined orb steps will show here</div>
      </TabbedMenu>
    </div>
  );
};

const StepTypePageNav: NavigationComponent = {
  Component: StepTypePage,
  Label: () => <p>New Step</p>,
};

export default StepTypePageNav;
