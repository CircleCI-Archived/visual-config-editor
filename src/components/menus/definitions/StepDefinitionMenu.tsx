import { reusable } from '@circleci/circleci-config-sdk';
import { Form, Formik } from 'formik';
import CommandIcon from '../../../icons/components/CommandIcon';
import { useStoreActions } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import BreadCrumbs from '../../containers/BreadCrumbs';
import { commandSubtypes } from '../../containers/inspector/subtypes/CommandSubtypes';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';

type StepDefinitionProps = {
  values?: Record<string, object>;
  editing?: boolean;
} & SubTypeMenuPageProps<any>;

const StepDefinitionMenu = (props: StepDefinitionProps) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const builtIn = typeof props.subtype === 'string';
  const builtInSubtype = builtIn
    ? commandSubtypes[props.subtype as string]
    : undefined;
  const customCommand = !builtIn
    ? (props.subtype as reusable.CustomCommand)
    : undefined;

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
          navigateBack({
            distance: 1,
            apply: (values: any) => {
              const name = builtIn ? props.subtype : customCommand?.name;

              values.steps = [
                ...values.steps,
                {
                  [name as string]: step.parameters,
                },
              ];

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
                  className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
                  type="button"
                  onClick={() => {
                    props.selectSubtype();
                  }}
                  disabled={!props.editing}
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
                {builtInSubtype ? builtInSubtype?.fields : 'custom fields'}
              </div>
            </TabbedMenu>

            <span className="border-b border-circle-gray-300 mt-auto" />
            <button
              type="submit"
              className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
            >
              Save Step
            </button>
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
