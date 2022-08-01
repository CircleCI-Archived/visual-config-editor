import { parsers, reusable } from '@circleci/circleci-config-sdk';
import { Command } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Command';
import CommandSummary from '../../components/atoms/summaries/CommandSummary';
import CommandInspector from '../../components/containers/inspector/CommandInspector';
import { componentParametersSubtypes } from '../../components/containers/inspector/subtypes/ParameterSubtypes';
import CommandIcon from '../../icons/components/CommandIcon';
import {
  DefinitionAction,
  definitionsAsArray,
} from '../../state/DefinitionStore';
import InspectableMapping from '../InspectableMapping';

export const UNDEFINED_COMMAND = new reusable.CustomCommand('deleted command');

export const CommandMapping: InspectableMapping<reusable.CustomCommand> = {
  key: 'commands',
  name: {
    singular: 'Command',
    plural: 'Commands',
  },
  defaults: {
    name: 'new-command',
    steps: [],
  },
  parameters: componentParametersSubtypes.command,
  subscriptions: {
    commands: (prev, cur, c) => {
      let steps;

      if (cur) {
        steps = c.steps.map((step) =>
          step instanceof reusable.ReusableCommand && step.name === prev.name
            ? new reusable.ReusableCommand(cur, step.parameters)
            : step,
        );
      } else {
        steps = c.steps.filter((step) =>
          step instanceof reusable.ReusableCommand
            ? step.name !== prev.name
            : true,
        );
      }

      return new reusable.CustomCommand(
        c.name,
        steps,
        c.parameters,
        c.description,
      );
    },
  },
  resolveObservables: (command) => ({
    commands: command.steps.filter(
      (command) => command instanceof reusable.ReusableCommand,
    ),
  }),
  transform: ({ name, ...values }, definitions) => {
    return parsers.parseCustomCommand(
      name,
      values,
      definitionsAsArray(definitions.commands),
      // TODO: Add dependency tracking to definition inspector, and use those arrays here
    );
  },
  store: {
    add: (actions) => actions.define_commands,
    update: (actions) => actions.update_commands,
    remove: (actions) => actions.delete_commands,
  },
  components: {
    icon: CommandIcon,
    summary: CommandSummary,
    inspector: CommandInspector,
  },
  docsInfo: {
    description:
      'A command defines a sequence of steps to be executed in a job.',
    link: 'https://circleci.com/docs/reusing-config/#the-commands-key',
  },
};

export type CommandAction = DefinitionAction<reusable.CustomCommand>;

export type CommandActions = {
  define_commands: CommandAction;
  update_commands: CommandAction;
  delete_commands: CommandAction;
  cleanup_commands: CommandAction;
};
