import { Form, Formik } from 'formik';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import BreadCrumbs from '../../containers/BreadCrumbs';
import ParameterContainer from '../../containers/ParametersContainer';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';

type InspectorDefinitionProps = DataModel & {
  values: Record<string, object>;
  editing?: boolean;
  passBackKey?: string;
  activeTab?: number;
  index: number;
  source?: Array<any>;
} & SubTypeMenuPageProps<any>;

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

  const getIcon = (className: string) => {
    let iconComponent = dataMapping?.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className={className} />;
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

  return (
    <div className="h-full flex flex-col">
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
            const source = props.source || definitions[dataMapping.type];
            const dupIndex = source.findIndex((d) =>
              (typeof d === 'string' ? d : d.name) === values.name.trim()
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
              distance: 1,
              apply: (parentValues) => {
                if (props.passBackKey) {
                  const { name, ...args } = values;

                  if (parentValues[props.passBackKey]) {
                    parentValues[props.passBackKey][name] = args;
                  } else {
                    parentValues[props.passBackKey] = { [name]: args };
                  }
                }

                return parentValues;
              },
            });
            generateConfig();
          }}
        >
          {(formikProps) => (
            <Form className="flex flex-col flex-1">
              <TabbedMenu tabs={tabs} activeTab={props.activeTab || 0}>
                <div className="p-6">
                  {dataMapping.subtypes &&
                    (props.editing ? (
                      <div className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left">
                        <p className="font-bold">
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
                        className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
                        type="button"
                        onClick={() => {
                          props.selectSubtype();
                        }}
                      >
                        <p className="font-bold">
                          {dataMapping.subtypes.definitions[subtype]?.text}
                        </p>
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
                  })}
                </div>
                {dataMapping.parameters ? (
                  <ParameterContainer
                    dataMapping={dataMapping}
                    values={formikProps.values}
                  />
                ) : null}
              </TabbedMenu>

              <span className="border-b border-circle-gray-300 mt-auto" />
              <button
                type="submit"
                className="text-white text-sm font-medium p-2 m-6 bg-circle-blue duration:50 transition-all rounded-md2"
              >
                {props.editing ? 'Save' : 'Create'} {dataMapping?.name.singular}
              </button>
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
