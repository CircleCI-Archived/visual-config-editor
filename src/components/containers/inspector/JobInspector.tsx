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
        Command: <Field required name="step.parameters.command"></Field>
        <br />
        Shell: <Field name="step.parameters.shell"></Field>
        <br />
        Background: <Field type="checkbox" name="step.parameters.background"></Field>
        <br />
        Working Directory: <Field name="step.parameters.workingDirectory"></Field>
        <br />
        No Output Timeout: <Field name="step.parameters.noOutputTimeout"></Field>
        <br />
        When: <Field as="select" name="step.parameters.when">
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
        Path: <Field name="step.parameters.path"></Field>
      </div>),
      generate: () => new commands.Checkout({ ...values.step.parameters })
    },
    'pesist_to_workspace': {
      text: 'Persist To Workspace',
      fields: (<div>
        Root: <Field required name="step.parameters.root"></Field>
        Path: <Field required name="step.parameters.path"></Field>
      </div>),
      generate: () => new commands.workspace.Persist({ root: values.step.root, paths: [values.step.root] })
    },
    'attach_workspace': {
      text: 'Attach Workspace',
      fields: (<div>
        At: <Field required name="step.parameters.at"></Field>
      </div>),
      generate: () => new commands.workspace.Attach({ ...values.step.parameters })
    },
    'store_artifacts': {
      text: 'Store Artifacts',
      fields: (<div>
        Path: <Field required name="step.parameters.path"></Field>
        <br />
        Destination: <Field name="step.parameters.destination"></Field>
      </div>),
      generate: () => new commands.StoreArtifacts({ ...values.step.parameters })
    },
    'store_test_results': {
      text: 'Store Test Results',
      fields: (<div>
        Path: <Field required name="step.parameters.path"></Field>
      </div>),
      generate: () => new commands.StoreTestResults({ ...values.step.parameters })
    },
    'save_cache': {
      text: 'Save Cache',
      fields: (<div>
        Path: <Field required name="step.parameters.path"></Field>
        <br />
        Key: <Field required name="step.parameters.key"></Field>
        <br />
        Path: <Field as="select" name="step.parameters.when">
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
        <h1>Configure Command Parameters</h1>
        {commandProps[values.newCommandType].fields}

        <button type="button" className="p-1 pt-0 pb-0 font-bold text-white bg-circle-blue rounded-lg"
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
      Name: <Field
        name="name"
        value={values.name}
      />
      <br />
      Executor: <Field
        name="executor"
        as="select">
        <option value='undefined' key='undefined'>Select Executor</option>
        {definitions.executors?.map((executor) =>
          <option value={JSON.stringify(executor)} key={executor.name}>{executor.name}</option>
        )}
      </Field>
      <FieldArray name="steps" render={
        arrayHelper => (<div>
          {values.steps.map((cmd: Command) => {
            const summary = commandProps[cmd.name].summary;

            if (summary) {
              return <div>{cmd.name}: {summary(cmd)}</div>
            } else {
              return <div>{cmd.name}</div>
            }
          })}

          Add Step: <Field as="select" name="newCommandType">
            {Object.keys(commandProps).map((cmd) =>
              <option value={cmd} key={cmd}>{commandProps[cmd].text}</option>
            )}
          </Field>
          {addCommand(arrayHelper)}
        </div>)
      } />
      <button type="submit" className="p-1 font-bold text-white bg-circle-blue rounded-lg">
        Save
      </button>
    </Form>
  )
}

export default JobInspector;