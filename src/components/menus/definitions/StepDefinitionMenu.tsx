import { reusable } from '@circleci/circleci-config-sdk';
import { job } from '@circleci/circleci-config-sdk/dist/src/lib/Types';
import { Form, Formik } from 'formik';
import CommandIcon from '../../../icons/components/CommandIcon';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import BreadCrumbs from '../../containers/BreadCrumbs';
import { commandSubtypes } from '../../containers/inspector/subtypes/CommandSubtypes';
import ParamListContainer from '../../containers/ParamListContainer';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';

type StepDefinitionProps = DataModel & {
  values?: Record<string, object>;
  editing?: boolean;
  index?: number;
  readonly data?: any;
} & SubTypeMenuPageProps<any>;

const StepDefinitionMenu = (props: StepDefinitionProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const definitions = useStoreState((state) => state.definitions);
  const subtype = props.subtype || props.values?.name;

  const isName = typeof subtype === 'string';
  const builtIn = isName && subtype in commandSubtypes;
  const builtInSubtype = builtIn
    ? commandSubtypes[subtype as string]
    : undefined;
  let customCommand: reusable.CustomCommand | undefined;

  if (!builtIn) {
    customCommand = isName
      ? Object.values(definitions.commands).find(
          (command) => (command.value.name = subtype),
        )?.value
      : (subtype as reusable.CustomCommand);
  }
  const dataMapping = props.dataType;

  const updateConfirmation = useStoreActions(
    (actions) => actions.updateConfirmation,
  );

  const deleteDefintion = useStoreActions(
    (actions) => dataMapping?.store.remove(actions) || actions.error,
  );

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-2 font-bold">New Step</h1>
      </header>
      <Formik
        initialValues={props.values || { parameters: undefined }}
        enableReinitialize={true}
        onSubmit={(step) => {
          const name = builtIn ? subtype : customCommand?.name;
          const parameters = builtIn ? step.parameters : step;

          navigateBack({
            toast: {
              label: name ?? '',
              content: 'saved',
              status: 'success',
            },
            distance: 1,
            applyValues: (values: any) => {
              if (!props.editing) {
                values.steps = [
                  ...values.steps,
                  {
                    [name as string]: parameters,
                  },
                ];
              } else {
                if (props.index === undefined) {
                  console.error('Step index was undefined when editing step.');

                  return values;
                }

                values.steps[props.index] = {
                  [name as string]: parameters,
                };
              }

              return values;
            },
            applyObservers: (current) => {
              if (customCommand) {
                const newDependency = {
                  type: 'commands',
                  name: customCommand.name,
                };

                return current ? [...current] : [newDependency];
              }

              return current;
            },
          });
        }}
      >
        {(formikProps) => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu tabs={['PROPERTIES']}>
              <div className="p-6">
                <button
                  className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
                  type="button"
                  onClick={() => {
                    props.selectSubtype();
                  }}
                  disabled={props.editing}
                >
                  <p className="font-bold">
                    {builtInSubtype
                      ? builtInSubtype?.name
                      : customCommand?.name}
                  </p>
                  <p className="text-sm mt-1 leading-4 text-circle-gray-500">
                    {builtInSubtype
                      ? builtInSubtype?.description
                      : customCommand?.description}
                  </p>
                </button>
                {builtInSubtype
                  ? builtInSubtype?.fields
                  : customCommand?.parameters && (
                      <ParamListContainer
                        props={formikProps}
                        paramList={customCommand.parameters}
                      />
                    )}
              </div>
            </TabbedMenu>

            <span className="border-b border-circle-gray-300 mt-auto" />
            <div className="display: flex	align-items: center justify-content: center">
              <button
                type="submit"
                className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
              >
                {props.editing ? 'Save Step' : 'Create Step'}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateBack({
                    distance: 1,
                  });
                }}
                className="text-white text-sm font-medium p-2 m-6 bg-circle-red duration:50 transition-all rounded-md2"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const StepDefinitionMenuNav: NavigationComponent = {
  Component: StepDefinitionMenu,
  Label: (props: StepDefinitionProps) => {
    return <p>{props.editing ? 'Edit' : 'New'} Step</p>;
  },
  Icon: (props: StepDefinitionProps) => {
    return <CommandIcon className="w-6 h-8 py-2" />;
  },
};

export { StepDefinitionMenu, StepDefinitionMenuNav };
