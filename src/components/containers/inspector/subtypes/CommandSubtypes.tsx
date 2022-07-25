import { ReactElement } from 'react';
import InspectorProperty from '../../../atoms/form/InspectorProperty';

export interface CommandSubTypes {
  [command: string]: {
    name: string;
    description?: string;
    summary?: (command: any) => ReactElement;
    fields: ReactElement;
    docsLink: string;
  };
}

const sourceURL = 'https://circleci.com/docs/configuration-reference';

const commandSubtypes: CommandSubTypes = {
  run: {
    name: 'Run a command',
    description: 'Used for invoking all command-line programs',
    summary: (command) => (
      <p className="inline">{command.parameters.command}</p>
    ),
    docsLink: `${sourceURL}#run`,
    fields: (
      <>
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
      </>
    ),
  },
  checkout: {
    name: 'Checkout',
    docsLink: `${sourceURL}#checkout`,
    description:
      'A special step used to check out source code to the configured path',
    fields: <InspectorProperty label="Path" name="parameters.path" />,
  },
  persist_to_workspace: {
    name: 'Persist To Workspace',
    description:
      'Persist a temporary file to be used by another job in the workflow',
    docsLink: `${sourceURL}#persisttoworkspace`,
    fields: (
      <>
        <InspectorProperty label="Root" name="parameters.root" required />
        <InspectorProperty label="Path" name="parameters.path" required />
      </>
    ),
  },
  attach_workspace: {
    name: 'Attach Workspace',
    docsLink: `${sourceURL}#attachworkspace`,
    description: 'Attach the workflow’s workspace to the current container',
    fields: <InspectorProperty label="At" name="parameters.at" required />,
  },
  store_artifacts: {
    name: 'Store Artifacts',
    docsLink: `${sourceURL}#storeartifacts`,
    description: 'Step to store artifacts such as logs and binaries',
    fields: (
      <>
        <InspectorProperty label="Path" name="parameters.path" required />
        <InspectorProperty
          label="Destination"
          name="parameters.destination"
          required
        />
      </>
    ),
  },
  store_test_results: {
    name: 'Store Test Results',
    docsLink: `${sourceURL}#storetestresults`,
    description: 'Upload and store test results for a build',
    fields: <InspectorProperty label="Path" name="parameters.path" required />,
  },
  save_cache: {
    name: 'Save Cache',
    docsLink: `${sourceURL}#savecache`,
    description:
      'Generates and stores a cache of a file or directory in object storage',
    fields: (
      <>
        <InspectorProperty label="Path" name="parameters.path" required />
        <InspectorProperty label="Key" name="parameters.key" required />
        <InspectorProperty label="When" name="parameters.when" as="select">
          <option value="undefined">Select When</option>
          <option value="always">Always</option>
          <option value="on_success">On Success</option>
          <option value="on_fail">On Fail</option>
        </InspectorProperty>
      </>
    ),
  },
  restore_cache: {
    name: 'Restore Cache',
    docsLink: `${sourceURL}#restorecache`,
    description:
      'Restores a previously saved cache based on a key. Cache needs to have been saved first for this key using Save Cache step.',
    fields: (
      <>
        <InspectorProperty label="Path" name="parameters.path" required />
        <InspectorProperty label="Key" name="parameters.key" required />
        <InspectorProperty label="When" name="parameters.when" as="select">
          <option value="undefined">Select When</option>
          <option value="always">Always</option>
          <option value="on_success">On Success</option>
          <option value="on_fail">On Fail</option>
        </InspectorProperty>
      </>
    ),
  },
};

export { commandSubtypes };
