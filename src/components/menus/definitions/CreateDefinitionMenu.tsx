import { Form, Formik } from 'formik';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { DataModel, NavigationComponent } from '../../../state/Store';
import BreadCrumbs from '../../containers/BreadCrumbs';
import ParameterContainer from '../../containers/ParametersContainer';
import { SubTypeMenuPageProps } from '../SubTypeMenu';
import TabbedMenu from '../TabbedMenu';

type CreateDefinitionProps = DataModel & {
  values: any;
  passBackKey?: string;
} & SubTypeMenuPageProps<any>;

const CreateDefinitionMenu = (props: CreateDefinitionProps) => {
  const definitions = useStoreState((state) => state.definitions);
  const generateConfig = useStoreActions((actions) => actions.generateConfig);
  const navigateBack = useStoreActions((actions) => actions.navigateBack);
  const dataMapping = props.dataType;
  const add = useStoreActions(
    (actions) => dataMapping?.store.add(actions) || actions.error,
  );
  const getIcon = (className: string) => {
    let iconComponent = dataMapping?.components.icon;

    if (iconComponent) {
      let Icon = iconComponent;

      return <Icon className={className} />;
    }
  };

  const tabs = ['PROPERTIES'];

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
            New {dataMapping?.name.singular}
          </h1>
        </div>
      </header>
      {dataMapping && (
        <Formik
          initialValues={{
            type: props.subtype,
            ...(props.values ||
              (props.subtype
                ? dataMapping.defaults[props.subtype]
                : dataMapping.defaults)),
          }}
          validateOnBlur
          validate={(values) => {
            const newDefinition = dataMapping.transform(values, definitions);

            generateConfig({ [dataMapping.type]: [newDefinition] });
          }}
          enableReinitialize
          onSubmit={(values) => {
            const newDefinition = dataMapping.transform(values, definitions);

            if (!props.passBackKey) {
              add(newDefinition);
            }
            navigateBack({
              distance: 1,
              apply: (values) => {
                if (props.passBackKey) {
                  values[props.passBackKey] = [
                    ...(values[props.passBackKey] || []),
                    newDefinition,
                  ];
                }
                return values;
              },
            });
            generateConfig();
          }}
        >
          {(formikProps) => (
            <Form className="flex flex-col flex-1">
              <TabbedMenu tabs={tabs} activeTab={props.values?.activeTab || 0}>
                <div className="p-6">
                  {dataMapping.subtypes && (
                    <button
                      className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
                      type="button"
                      onClick={() => {
                        props.selectSubtype();
                      }}
                    >
                      <p className="font-bold">
                        {dataMapping.subtypes.definitions[props.subtype]?.text}
                      </p>
                      <p className="text-sm mt-1 leading-4 text-circle-gray-500">
                        {
                          dataMapping.subtypes.definitions[props.subtype]
                            ?.description
                        }
                      </p>
                    </button>
                  )}
                  {dataMapping.components.inspector({
                    ...formikProps,
                    definitions,
                    subtype: props.subtype,
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
                Save {dataMapping?.name.singular}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

const CreateDefinitionMenuNav: NavigationComponent = {
  Component: CreateDefinitionMenu,
  Label: (props: CreateDefinitionProps) => {
    return <p>New {props.dataType?.name.singular}</p>;
  },
  Icon: (props: CreateDefinitionProps) => {
    let iconComponent = props.dataType?.components.icon;

    if (!iconComponent) {
      return null;
    }

    let DefinitionIcon = iconComponent;

    return <DefinitionIcon className="w-6 h-8 py-2" />;
  },
};

export { CreateDefinitionMenuNav, CreateDefinitionMenu };
