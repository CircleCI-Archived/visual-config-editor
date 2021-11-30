import { commands } from '@circleci/circleci-config-sdk';
import { CustomCommand } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Commands/exports/Reusable';
import { Form, Formik } from 'formik';
import { useStoreActions } from '../../../state/Hooks';
import BreadCrumbs from '../../containers/BreadCrumbs';
import { commandSubtypes } from '../../containers/inspector/subtypes/CommandSubtypes';
import TabbedMenu from '../TabbedMenu';
import { SubTypeMenuPageProps } from '../SubTypeMenu';

const StepPropertiesMenu = (
  props: SubTypeMenuPageProps<string | CustomCommand>,
) => {
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const builtIn = typeof props.subtype === 'string';
  const builtInSubtype = builtIn
    ? commandSubtypes[props.subtype as string]
    : undefined;
  const customCommand = !builtIn ? (props.subtype as CustomCommand) : undefined;

  return (
    <div className="h-full flex flex-col">
      <header>
        <BreadCrumbs />
        <h1 className="ml-6 text-2xl py-2 font-bold">New Step</h1>
      </header>
      <Formik
        initialValues={{ parameters: {} }}
        enableReinitialize={true}
        onSubmit={(parameters) => {
          navigateBack({
            distance: 1,
            apply: (values: any) => {
              values.steps = [
                ...values.steps,
                builtInSubtype
                  ? builtInSubtype.generate(parameters)
                  : new commands.reusable.ReusableCommand(
                      props.subtype as CustomCommand,
                      values.parameters,
                    ),
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
                >
                  <p className="font-bold">
                    {builtInSubtype
                      ? builtInSubtype?.text
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
                  : 'custom fields'}
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
// const StepPropertiesMenuNav: NavigationComponent = {
//   Component: StepPropertiesMenu,
//   Label: () => <p>New Step</p>,
// };

export default StepPropertiesMenu;
