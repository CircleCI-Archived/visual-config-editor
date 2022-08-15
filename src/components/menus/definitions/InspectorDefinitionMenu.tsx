import { Form, Formik } from 'formik';
import EditIcon from '../../../icons/ui/EditIcon';
import InspectableMapping from '../../../mappings/InspectableMapping';
import {
  DefinitionsModel,
  DefinitionSubscriptions,
} from '../../../state/DefinitionStore';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import { Button } from '../../atoms/Button';
import { Footer } from '../../atoms/Footer';
import BreadCrumbs from '../../containers/BreadCrumbs';
import ParameterContainer from '../../containers/ParametersContainer';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';

type InspectorDefinitionProps = DataModel & {
  values: Record<string, object>;
  dependencies: Array<DefinitionSubscriptions>;
  editing?: boolean;
  passBackKey?: string;
  activeTab?: number;
  index: number;
  source?: Array<any>;
  toast: boolean;
  // The source of generable
  // modifying this would not be good
  readonly data?: any;
} & SubTypeMenuPageProps<any>;

const getDependencies = (
  store: DefinitionsModel,
  mapping: InspectableMapping,
  name: string,
): number => {
  const definition = store[mapping.key][name];

  if (!definition || !definition.observers) {
    return 0;
  }

  let count = 0;

  Object.values(definition.observers).forEach((observer) => {
    count += Object.values(observer).reduce((acc, value) => acc + value);
  });

  return count;
};

/**
 * The menu that allows for inspection (creation and editing) of a definition
 * This is one of the more complex pieces of the VCE, as it handles
 * the abstraction of all components registered with a InspectableMapping,
 * also handles parameterized components.
 *
 * The inspector menu opens from "New" button in the Definition
 * container, or from the "Definition" atom, which edits an
 * existing definition.
 *
 * Related:
 * For Orb definitions see OrbDefinitionsMenu.tsx
 * For Step definitions see StepDefinitionMenu.tsx
 */
const InspectorDefinitionMenu = (props: InspectorDefinitionProps) => {
  const definitions = useStoreState((state) => state.definitions);
  const generateConfig = useStoreActions((actions) => actions.generateConfig);
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const setGuideStep = useStoreActions((actions) => actions.setGuideStep);
  const guideStep = useStoreState((state) => state.guideStep);
  const dataMapping = props.dataType;
  const submitToStore = useStoreActions(
    (actions) =>
      (props.editing
        ? dataMapping?.store.update(actions)
        : dataMapping?.store.add(actions)) || actions.error,
  );
  const deleteDefinition = useStoreActions(
    (actions) => dataMapping?.store.remove(actions) || actions.error,
  );

  // TODO: useMemo for these functions?
  const getIcon = (className: string) => {
    let iconComponent = dataMapping?.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className={className} type={props.subtype} />;
    }
  };

  const getValues = () => {
    if (props.values) {
      return props.values;
    }

    return props.subtype
      ? dataMapping?.defaults[props.subtype]
      : dataMapping?.defaults;
  };

  const tabs = ['PROPERTIES'];
  const unpacked = getValues();
  const subtype = props.subtype || dataMapping?.subtypes?.getSubtype(unpacked);

  if (dataMapping?.parameters) {
    tabs.push('PARAMETERS');
  }

  const updateConfirmation = useStoreActions(
    (actions) => actions.triggerConfirmation,
  );
  return (
    <div
      aria-label="Inspector Definition Menu"
      className="h-full flex flex-col"
    >
      <header>
        <BreadCrumbs />
        <div className="ml-6 py-3 flex">
          {getIcon('w-8 h-8 p-1 pl-0 mr-1')}
          <h1 className="text-2xl font-bold">
            {props.editing ? 'Edit' : 'New'} {dataMapping?.name.singular}
          </h1>
        </div>
      </header>
      {dataMapping && (
        <Formik
          initialValues={{
            ...unpacked,
          }}
          validateOnBlur
          validate={(values) => {
            // TODO: define error type
            const errors: any = {};
            const source = props.source ?? definitions[dataMapping.key];
            const dupIndex = Object.values(source).findIndex(
              (d) =>
                (typeof d === 'string' ? d : d.value.name) ===
                values.name.trim(),
            );

            if (dupIndex !== -1 && dupIndex !== props.index) {
              errors.name = 'Name is already in use';
            }

            return errors;
          }}
          enableReinitialize
          onSubmit={(values) => {
            if (!props.passBackKey) {
              const newDefinition = dataMapping.transform(values, definitions);
              const submitData = props.editing
                ? { old: unpacked, new: newDefinition }
                : newDefinition;

              submitToStore(submitData);
            }

            if (
              !props.editing &&
              guideStep &&
              dataMapping.guide?.step === guideStep
            ) {
              setGuideStep(guideStep + 1);
            }

            navigateBack({
              toast: {
                label: values.name.trim(),
                content: 'saved',
                status: 'success',
              },
              distance: 1,
              applyValues: (parentValues) => {
                if (props.passBackKey) {
                  const { name, ...args } = values;
                  const nestedValues = {
                    ...parentValues[props.passBackKey],
                    [name]: args,
                  };

                  if (
                    name !== props.values?.name &&
                    typeof props.values?.name === 'string'
                  ) {
                    delete nestedValues[props.values.name];
                  }

                  return {
                    ...parentValues,
                    [props.passBackKey]: nestedValues,
                  };
                }
              },
            });
            generateConfig();
          }}
        >
          {(formikProps) => (
            <Form className="flex flex-col flex-1">
              <TabbedMenu tabs={tabs} activeTab={props.activeTab || 0}>
                <div
                  className="p-6 overflow-y-auto"
                  style={{ height: 'calc(100vh - 220px)' }}
                >
                  {dataMapping.subtypes &&
                    (props.editing ? (
                      <div className="p-4 mb-4 w-full border-circle-gray-300 border hover:border-circle-black rounded text-left">
                        <p className="font-medium">
                          {dataMapping.subtypes.definitions[subtype]?.text}
                        </p>
                        <p className="text-sm mt-1 leading-4 text-circle-gray-500">
                          {
                            dataMapping.subtypes.definitions[subtype]
                              ?.description
                          }
                        </p>
                      </div>
                    ) : (
                      <button
                        className="p-4 mb-4 w-full border-circle-gray-300 border hover:border-circle-black rounded text-left"
                        type="button"
                        onClick={() => {
                          props.selectSubtype();
                        }}
                      >
                        <div className="w-full flex flex-row">
                          <p className="font-medium">
                            {dataMapping.subtypes.definitions[subtype]?.text}
                          </p>
                          <EditIcon className="ml-auto flex w-4" />
                        </div>
                        <p className="text-sm mt-1 leading-4 text-circle-gray-500">
                          {
                            dataMapping.subtypes.definitions[subtype]
                              ?.description
                          }
                        </p>
                      </button>
                    ))}
                  {dataMapping.components.inspector({
                    ...formikProps,
                    definitions,
                    subtype,
                    data: props.data,
                  })}
                </div>
                {dataMapping.parameters && (
                  <div
                    style={{ height: 'calc(100vh - 220px)' }}
                    className="overflow-y-auto"
                  >
                    <ParameterContainer
                      dataMapping={dataMapping}
                      values={formikProps.values}
                    />
                  </div>
                )}
              </TabbedMenu>

              <Footer>
                {props.editing && (
                  <Button
                    variant="dangerous"
                    type="button"
                    onClick={() => {
                      updateConfirmation({
                        modalDialogue: 'delete',
                        labels: [
                          dataMapping.name.singular,
                          props.data.name,
                          getDependencies(
                            definitions,
                            dataMapping,
                            props.data.name,
                          ),
                        ],
                        onConfirm: () => {
                          deleteDefinition(props.data);
                          navigateBack({
                            distance: 1,
                          });
                        },
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}

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
                  // disabled={!formikProps.dirty}
                >
                  {props.editing ? 'Save' : 'Create'}
                </Button>
              </Footer>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

const InspectorDefinitionMenuNav: NavigationComponent = {
  Component: InspectorDefinitionMenu,
  Label: (props: InspectorDefinitionProps) => {
    return (
      <p>
        {props.editing ? 'Edit' : 'New'} {props.dataType?.name.singular}
      </p>
    );
  },
  Icon: (props: InspectorDefinitionProps) => {
    let iconComponent = props.dataType?.components.icon;

    if (!iconComponent) {
      return null;
    }

    let DefinitionIcon = iconComponent;

    return <DefinitionIcon className="w-6 h-8 py-2" />;
  },
};

export { InspectorDefinitionMenuNav, InspectorDefinitionMenu };
