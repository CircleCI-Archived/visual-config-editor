import { parsers, reusable } from '@circleci/circleci-config-sdk';
import CommandSummary from '../components/atoms/summaries/CommandSummary';
import CommandInspector from '../components/containers/inspector/CommandInspector';
import { componentParametersSubtypes } from '../components/containers/inspector/subtypes/ParameterSubtypes';
import CommandIcon from '../icons/components/CommandIcon';
import { DefinitionAction, definitionsAsArray } from '../state/DefinitionStore';
import GenerableMapping from './GenerableMapping';

export const CommandMapping: GenerableMapping<reusable.CustomCommand> = {
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
  subscriptions: {
    commands: (prev, cur, c) => {
      const steps = c.steps.map((step) =>
        step instanceof reusable.ReusableCommand && step.name === prev.name
          ? new reusable.ReusableCommand(cur, step.parameters)
          : step,
      );

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
    link: 'https://circleci.com/docs/2.0/reusing-config/#the-commands-key',
  },
};

export type CommandAction = DefinitionAction<reusable.CustomCommand>;

export type CommandActions = {
  define_commands: CommandAction;
  update_commands: CommandAction;
  delete_commands: CommandAction;
};
