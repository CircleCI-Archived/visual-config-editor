import { commands } from '@circleci/circleci-config-sdk';
import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/Reusable';
import CommandSummary from '../components/atoms/summaries/CommandSummary';
import CommandInspector from '../components/containers/inspector/CommandInspector';
import CommandIcon from '../icons/components/CommandIcon';
import ComponentMapping from './ComponentMapping';

const CommandMapping: ComponentMapping<CustomCommand> = {
  type: 'command',
  name: {
    singular: 'Command',
    plural: 'Commands',
  },
  defaults: {},
  transform: (values: any) =>
    new commands.reusable.CustomCommand(
      values.string,
      values.parameters,
      values.steps,
    ),
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
};

export default CommandMapping;
