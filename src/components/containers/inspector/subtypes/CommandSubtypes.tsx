import { commands } from '@circleci/circleci-config-sdk';
import { Command } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Command';
import { Field } from 'formik';
import { ReactElement } from 'react';
import InspectorProperty from '../../../atoms/form/InspectorProperty';

export interface CommandSubTypes {
  [command: string]: {
    text: string;
    description?: string;
    summary?: (command: any) => ReactElement;
    fields: ReactElement;
    generate: (values: any) => Command;
  };
}

const commandSubtypes: CommandSubTypes = {
  run: {
    text: 'Run a command',
    description: 'Used for invoking all command-line programs',
    summary: (command) => (
      <p className="inline">{command.parameters.command}</p>
    ),
    fields: (
      <div>
        <InspectorProperty
          label="Command"
          as="textarea"
          required
          name="parameters.command"
        />
        <InspectorProperty label="Shell" name="parameters.shell" />
        <InspectorProperty
          label="Background"
          type="checkbox"
          name="parameters.background"
        />
        <InspectorProperty
          label="Working Directory"
          name="parameters.working_directory"
        />
        <InspectorProperty
          label="No Output Timeout"
          name="parameters.no_output_timeout"
        />
        <InspectorProperty label="When" as="select" name="parameters.when">
          <option value="undefined">Select When</option>
          <option value="always">Always</option>
          <option value="on_success">On Success</option>
          <option value="on_fail">On Fail</option>
        </InspectorProperty>
      </div>
    ),
    generate: (values) => new commands.Run({ ...values.parameters }),
  },
  checkout: {
    text: 'Checkout',
    description:
      'A special step used to check out source code to the configured path',
    fields: <InspectorProperty label="Path" name="parameters.path" />,
    generate: (values) => new commands.Checkout({ ...values.parameters }),
  },
  persist_to_workspace: {
    text: 'Persist To Workspace',
    description:
      'Persist a temporary file to be used by another job in the workflow',
    fields: (
      <div>
        <InspectorProperty label="Root" name="parameters.root" required />
        <InspectorProperty label="Path" name="parameters.path" required />
      </div>
    ),
    generate: (values) =>
      new commands.workspace.Persist({
        root: values.parameters.root,
        paths: [values.parameters.path],
      }),
  },
  attach_workspace: {
    text: 'Attach Workspace',
    description: 'Attach the workflow’s workspace to the current container',
    fields: <InspectorProperty label="At" name="parameters.at" required />,
    generate: (values) =>
      new commands.workspace.Attach({ ...values.parameters }),
  },
  store_artifacts: {
    text: 'Store Artifacts',
    description: 'Step to store artifacts such as logs and binaries',
    fields: (
      <div>
        Path
        <Field
          required
          name="parameters.path"
          className="p-1 w-full border-circle-light-blue border-2 rounded"
        ></Field>
        <br />
        Destination
        <Field
          name="parameters.destination"
          className="p-1 w-full border-circle-gray-300 border-2 rounded"
        ></Field>
      </div>
    ),
    generate: (values) => new commands.StoreArtifacts({ ...values.parameters }),
  },
  store_test_results: {
    text: 'Store Test Results',
    description: 'Upload and store test results for a build',
    fields: <InspectorProperty label="Path" name="parameters.path" required />,
    generate: (values) =>
      new commands.StoreTestResults({ ...values.parameters }),
  },
  save_cache: {
    text: 'Save Cache',
    description:
      'Generates and stores a cache of a file or directory in object storage',
    fields: (
      <div>
        <InspectorProperty label="Path" name="parameters.path" required />
        <InspectorProperty label="Key" name="parameters.key" required />
        <InspectorProperty label="When" name="parameters.when" as="select">
          <option value="undefined">Select When</option>
          <option value="always">Always</option>
          <option value="on_success">On Success</option>
          <option value="on_fail">On Fail</option>
        </InspectorProperty>
      </div>
    ),
    generate: (values) =>
      new commands.cache.Save({
        paths: [values.parameters.path],
        key: values.parameters.key,
        when: values.parameters.when,
      }),
  },
};

export { commandSubtypes };
