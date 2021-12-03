import { FieldArray, useField } from 'formik';
import ComponentMapping from '../../mappings/ComponentMapping';
import ParameterMapping from '../../mappings/ParameterMapping';
import { useStoreActions } from '../../state/Hooks';
import { CreateDefinitionMenu } from '../menus/definitions/CreateDefinitionMenu';
import SubTypeMenuNav from '../menus/SubTypeMenu';

const ParameterContainer = (props: {
  dataMapping: ComponentMapping;
  values: any;
}) => {
  const [field] = useField(props.values.parameters);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);

  return (
    <FieldArray
      {...field}
      name="parameters"
      render={(arrayHelpers) => (
        <div className="p-6 flex flex-col">
          <button
            type="button"
            onClick={() => {
              navigateTo({
                component: SubTypeMenuNav,
                props: {
                  typePage: ParameterMapping.subtypes?.component,
                  typeProps: { component: props.dataMapping },
                  menuPage: CreateDefinitionMenu,
                  menuProps: {
                    dataType: ParameterMapping,
                    passBackKey: 'parameters',
                  },
                },
                values: {
                  ...props.values,
                },
              });
            }}
            className="m-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium mb-4"
          >
            Add Parameter
          </button>
          {props.values.parameters?.map((parameter: any) => (
            <div
              key={parameter.name}
              className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
            >
              <div className="flex">
                <p className="font-bold">{parameter.name}</p>
              </div>
              {parameter.description && (
                <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                  {parameter.description}
                </p>
              )}
              {parameter.defaultValue ? (
                <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                  {parameter.description}
                </p>
              ) : (
                <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                  Required
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default ParameterContainer;
