import { reusable } from '@circleci/circleci-config-sdk';
import { Form, Formik } from 'formik';
import CommandIcon from '../../../icons/components/CommandIcon';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import { Button } from '../../atoms/Button';
import BreadCrumbs from '../../containers/BreadCrumbs';
import { commandSubtypes } from '../../containers/inspector/subtypes/CommandSubtypes';
import ParamListContainer from '../../containers/ParamListContainer';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';

export type StepDefinitionProps = DataModel & {
  values?: Record<string, object>;
  editing?: boolean;
  index?: number;
  getter?: (values: any) => Array<Record<string, unknown>>;
  setter?: (values: any, value: any) => void;
} & SubTypeMenuPageProps<any>;

const defaultGetter = (values: any) => values.steps;
const defaultSetter = (values: any, value: any) => (values.steps = value);

const StepDefinitionMenu = (props: StepDefinitionProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const definitions = useStoreState((state) => state.definitions);
  const subtype = props.subtype || props.values?.name;
  const valueGetter = props.getter || defaultGetter;
  const valueSetter = props.setter || defaultSetter;

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
              const newStep = {
                [name as string]: parameters,
              };

              const value = valueGetter(values) || [];

              if (!props.editing) {
                valueSetter(values, [...value, newStep]);
              } else {
                if (props.index === undefined) {
                  console.error('Step index was undefined when editing step.');

                  return values;
                }

                values.steps[props.index] = newStep;
                value[props.index] = newStep;
              }

              return values;
            },
          });
        }}
      >
        {(formikProps) => (
          <Form className="flex flex-col flex-1">
            <TabbedMenu tabs={['PROPERTIES']}>
              <div className="p-6">
                <button
                  className="p-4 mb-4 w-full border-circle-gray-300 border hover:border-circle-black rounded-sm text-left"
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
            <div className="flex flex-row ml-auto center py-6 mr-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  navigateBack({
                    distance: 1,
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!formikProps.dirty}
              >
                {props.editing ? 'Save Step' : 'Create Step'}
              </Button>
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
