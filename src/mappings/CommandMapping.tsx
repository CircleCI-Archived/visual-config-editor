import { parsers } from '@circleci/circleci-config-sdk';
import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Reusable';
import CommandSummary from '../components/atoms/summaries/CommandSummary';
import CommandInspector from '../components/containers/inspector/CommandInspector';
import { componentParametersSubtypes } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import CommandIcon from '../icons/components/CommandIcon';
import ComponentMapping from './ComponentMapping';

const CommandMapping: ComponentMapping<CustomCommand> = {
  type: 'commands',
  name: {
    singular: 'Command',
    plural: 'Commands',
  },
  defaults: {
    name: 'new-command',
    steps: [],
  },
  parameters: componentParametersSubtypes.command,
  transform: ({ name, ...values }, definitions) => {
    return parsers.parseCustomCommand(name, values, definitions.commands);
  },
  store: {
    get: (state) => state.definitions.commands,
    add: (actions) => actions.defineCommand,
    update: (actions) => actions.updateCommand,
    remove: (actions) => actions.undefineCommand,
  },
  components: {
    icon: CommandIcon,
    summary: CommandSummary,
    inspector: CommandInspector,
  },
  docsInfo: {
    description: 'Sequenced steps to be executed',
    link: 'https://circleci.com/docs/2.0/reusing-config/#the-commands-key',
  },
};

export default CommandMapping;
