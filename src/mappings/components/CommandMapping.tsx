import { parseReusableCommand } from '@circleci/circleci-config-parser';
import { reusable } from '@circleci/circleci-config-sdk';
import CommandSummary from '../../core/components/atoms/summaries/CommandSummary';
import CommandInspector from '../../core/components/containers/inspector/CommandInspector';
import { componentParametersSubtypes } from '../../core/components/containers/inspector/subtypes/ParameterSubtypes';
import CommandIcon from '../../core/icons/components/CommandIcon';
import {
  DefinitionAction,
  definitionsAsArray,
} from '../../core/state/DefinitionStore';
import InspectableMapping from '../InspectableMapping';

export const CommandMapping: InspectableMapping<reusable.ReusableCommand> = {
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
          step instanceof reusable.ReusedCommand && step.name === prev.name
            ? new reusable.ReusedCommand(cur, step.parameters)
            : step,
        );
      } else {
        steps = c.steps.filter((step) =>
          step instanceof reusable.ReusedCommand
            ? step.name !== prev.name
            : true,
        );
      }

      return new reusable.ReusableCommand(
        c.name,
        steps,
        c.parameters,
        c.description,
      );
    },
  },
  resolveObservables: (command) => ({
    commands: command.steps.filter(
      (command) => command instanceof reusable.ReusedCommand,
    ),
  }),
  transform: ({ name, ...values }, definitions) => {
    return parseReusableCommand(
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
    description: 'A %s defines a sequence of steps to be executed in a job.',
    link: 'https://circleci.com/docs/reusing-config/#the-commands-key',
  },
};

export type CommandAction = DefinitionAction<reusable.ReusableCommand>;

export type CommandActions = {
  define_commands: CommandAction;
  update_commands: CommandAction;
  delete_commands: CommandAction;
  cleanup_commands: CommandAction;
};
