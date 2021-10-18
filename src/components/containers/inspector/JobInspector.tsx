import { commands, Job } from "@circleci/circleci-config-sdk";
import { Command } from "@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/Command";
import { ArrayHelpers, Field, FieldArray, Form, FormikValues } from "formik";
import { ReactElement } from "react";
import { DefinitionModel } from "../../../state/Store";

const JobInspector = (definitions: DefinitionModel) => ({
  values,
  handleChange,
  handleBlur,
  handleSubmit
}: FormikValues & { data: Job }) => {

  const commandProps: {
    [command: string]: {
      text: string;
      summary?: (command: any) => ReactElement;
      fields: ReactElement;
      // step is values passed in. Can be previous job or new job
      generate?: () => Command;
    }
  } = {
    'none': {
      text: 'Select a command type',
      fields: <div hidden />
    },
    'run': {
      text: 'Run a command',
      summary: (command) => (<p className="inline">{command.parameters.command}</p>),
      fields: (<div>
        Command <Field required name="step.parameters.command"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
        <br />
        Shell <Field name="step.parameters.shell"
          className="p-1 w-full border-circle-gray-300 border-2 rounded"></Field>
        <br />
        Background <Field type="checkbox" name="step.parameters.background"
          className="p-1 border-circle-gray-300 border-2 rounded"></Field>
        <br />
        Working Directory <Field name="step.parameters.working_directory"
          className="p-1 w-full border-circle-gray-300 border-2 rounded"></Field>
        <br />
        No Output Timeout: <Field name="step.parameters.no_output_timeout"
          className="p-1 w-full border-circle-gray-300 border-2 rounded"></Field>
        <br />
        When <Field as="select" name="step.parameters.when"
          className="p-1 w-full border-circle-gray-300 border-2 rounded">
          <option value='always'>Always</option>
          <option value='on_success'>On Success</option>
          <option value='on_fail'>On Fail</option>
        </Field>
      </div>),
      generate: () => new commands.Run({ ...values.step.parameters })
    },
    'checkout': {
      text: 'Checkout',
      fields: (<div>
        Path: <Field name="step.parameters.path" className="p-1 w-full border-circle-gray-300 border-2 rounded"></Field>
      </div>),
      generate: () => new commands.Checkout({ ...values.step.parameters })
    },
    'persist_to_workspace': {
      text: 'Persist To Workspace',
      fields: (<div>
        Root: <Field required name="step.parameters.root"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
        <br />
        Path: <Field required name="step.parameters.path"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
      </div>),
      generate: () => new commands.workspace.Persist({ root: values.step.parameters.root, paths: [values.step.parameters.path] })
    },
    'attach_workspace': {
      text: 'Attach Workspace',
      fields: (<div>
        At: <Field required name="step.parameters.at"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
      </div>),
      generate: () => new commands.workspace.Attach({ ...values.step.parameters })
    },
    'store_artifacts': {
      text: 'Store Artifacts',
      fields: (<div>
        Path: <Field required name="step.parameters.path"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
        <br />
        Destination: <Field name="step.parameters.destination"
          className="p-1 w-full border-circle-gray-300 border-2 rounded"></Field>
      </div>),
      generate: () => new commands.StoreArtifacts({ ...values.step.parameters })
    },
    'store_test_results': {
      text: 'Store Test Results',
      fields: (<div>
        Path <Field required name="step.parameters.path"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
      </div>),
      generate: () => new commands.StoreTestResults({ ...values.step.parameters })
    },
    'save_cache': {
      text: 'Save Cache',
      fields: (<div>
        Path <Field required name="step.parameters.path"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
        <br />
        Key <Field required name="step.parameters.key"
          className="p-1 w-full border-circle-light-blue border-2 rounded"></Field>
        <br />
        When <Field as="select" name="step.parameters.when">
          <option value='always'>Always</option>
          <option value='on_success'>On Success</option>
          <option value='on_fail'>On Fail</option>
        </Field>
      </div>),
      generate: () => new commands.cache.Save({
        paths: [values.step.parameters.path],
        key: values.step.parameters.key,
        when: values.step.parameters.when
      })
    }
  }

  const addCommand = (arrayHelper: ArrayHelpers) => {

    const generate = commandProps[values.newCommandType || 'none'].generate;

    if (generate) {
      return (<div>
        <h1 className="text-lg m-2 pl-4 border-b-4 border-circle-gray-400 mx-auto">Configure Command Parameters</h1>
        {commandProps[values.newCommandType].fields}
        <br />
        <button type="button" className="px-2 py-0 font-bold text-white w-full bg-circle-blue rounded-lg"
          onClick={() => {
            const newStep = generate();

            // reset the values properties 
            values.step = { parameters: {} };
            values.newCommandType = 'none';

            // push new step to job, also refreshes container with reset properties
            arrayHelper.push(newStep);
          }}>
          Add Step
        </button>
      </div>)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      Name <Field
        className="p-1 w-full border-circle-blue-light border-2 rounded"
        name="name"
        value={values.name}
      />
      <br />
      Executor <Field
        name="executor"
        className="p-1 w-full border-circle-blue-light border-2 rounded"
        as="select">
        <option value='undefined' key='undefined'>Select Executor</option>
        {definitions.executors?.map((executor) =>
          <option value={JSON.stringify(executor)} key={executor.name}>{executor.name}</option>
        )}
      </Field>
      <FieldArray name="steps" render={
        arrayHelper => (<div>
          {values.steps.map((cmd: Command) => {
            console.log(cmd)
            const summary = commandProps[cmd.name].summary;

            if (summary) {
              return <div>{cmd.name}: {summary(cmd)}</div>
            } else {
              return <div>{cmd.name}</div>
            }
          })}

          Add Step <Field as="select" name="newCommandType"
            className="p-1 w-full border-circle-gray-300 border-2 rounded">
            {Object.keys(commandProps).map((cmd) =>
              <option value={cmd} key={cmd}>{commandProps[cmd].text}</option>
            )}
          </Field>
          {addCommand(arrayHelper)}
        </div>)
      } />
      <br />
      <button type="submit" className="p-1 font-bold w-full text-white border-circle-gray-300 bg-circle-blue rounded-lg">
        Save
      </button>
    </Form>
  )
}

export default JobInspector;