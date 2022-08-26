import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Reusable';
import { useStoreState } from '../../../../state/Hooks';
import { NavigationComponent } from '../../../../state/Store';
import BreadCrumbs from '../../../containers/BreadCrumbs';
import { commandSubtypes } from '../../../containers/inspector/subtypes/CommandSubtypes';
import TabbedMenu from '../../TabbedMenu';
import { SubTypeSelectPageProps } from '../../SubTypeMenu';
import { mapDefinitions } from '../../../../state/DefinitionStore';
import { orb, reusable } from '@circleci/circleci-config-sdk';
import Card from '../../../atoms/Card';
import { Empty } from '../../../atoms/Empty';
import OrbIcon from '../../../../icons/components/OrbIcon';
import CommandIcon from '../../../../icons/components/CommandIcon';
import CollapsibleList from '../../../containers/CollapsibleList';
import { CommandParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import { OrbImportWithMeta } from '../OrbDefinitionsMenu';

const StepTypePage = (
  props: SubTypeSelectPageProps<
    string | CustomCommand | orb.OrbRef<CommandParameterLiteral>
  >,
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
        <div className="p-6 flex-col overflow-y-scroll">
          {Object.entries(commandSubtypes).map(([name, subtype]) => (
            <Card
              key={name}
              description={subtype.description}
              title={subtype.name}
              onClick={() => {
                props.setSubtype(name);
              }}
              pinned={
                <>
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
                </>
              }
            />
          ))}
        </div>
        <div className="p-6 flex-col overflow-y-scroll">
          {Object.values(definitions.commands).length > 0 ? (
            mapDefinitions<reusable.CustomCommand>(
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
            )
          ) : (
            <Empty
              label="No Custom Commands"
              Logo={CommandIcon}
              description="Create a custom command to use it here"
            />
          )}
        </div>
        <div className="p-6 overflow-y-scroll">
          {Object.values(definitions.orbs).length > 0 ? (
            mapDefinitions<OrbImportWithMeta>(definitions.orbs, (orb) => (
              <CollapsibleList
                pinned={
                  <p className="font-normal flex ml-auto text-gray-400">
                    {orb.version}
                  </p>
                }
                alwaysShowPinned
                title={
                  <div className="flex flex-row w-full">
                    <img
                      className="w-6 p-1 mr-2"
                      src={orb.logo_url}
                      alt={`${orb.name} logo`}
                    />
                    <p className="font-normal text-gray-500">
                      {orb.namespace}/
                    </p>
                    {orb.name}
                  </div>
                }
              >
                <div className="pt-2">
                  {orb.commands &&
                    Object.values(orb.commands)?.map((command) => (
                      <Card
                        title={command.name}
                        key={command.name}
                        onClick={() => {
                          props.setSubtype(command);
                        }}
                      />
                    ))}
                </div>
              </CollapsibleList>
            ))
          ) : (
            <Empty
              label="No Imported Orbs"
              Logo={OrbIcon}
              description="Import an orb with commands, and they will be accessible here"
            />
          )}
        </div>
      </TabbedMenu>
    </div>
  );
};

const StepTypePageNav: NavigationComponent = {
  Component: StepTypePage,
  Label: () => <p>New Step</p>,
};

export default StepTypePageNav;
