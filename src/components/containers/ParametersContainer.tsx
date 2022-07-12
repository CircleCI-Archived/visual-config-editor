import { FieldArray, useField } from 'formik';
import GenerableMapping from '../../mappings/GenerableMapping';
import ParameterMapping from '../../mappings/ParameterMapping';
import { useStoreActions } from '../../state/Hooks';
import { InspectorDefinitionMenu } from '../menus/definitions/InspectorDefinitionMenu';
import { navSubTypeMenu } from '../menus/SubTypeMenu';
const ParameterContainer = (props: {
  dataMapping: GenerableMapping;
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
              if (!ParameterMapping.subtypes) {
                return;
              }

              navigateTo(
                navSubTypeMenu(
                  {
                    typePage: ParameterMapping.subtypes.component,
                    typeProps: { component: props.dataMapping },
                    menuPage: InspectorDefinitionMenu,
                    menuProps: {
                      dataType: ParameterMapping,
                      passBackKey: 'parameters',
                      index: -1,
                      source: props.values.parameters
                        ? Object.keys(props.values.parameters)
                        : undefined,
                    },
                  },
                  props.values,
                ),
              );
            }}
            className="m-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium mb-4"
          >
            Add Parameter
          </button>
          {props.values.parameters &&
            Object.entries(props.values.parameters).map(
              ([name, parameter]: [string, any]) => (
                <div
                  key={name}
                  className="p-4 mb-4 w-full border-circle-gray-300 border-2 rounded text-left"
                >
                  <div className="flex">
                    <p className="font-bold">{name}</p>
                  </div>
                  {parameter.description && (
                    <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                      {parameter.description}
                    </p>
                  )}
                  {parameter.defaultValue ? (
                    <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                      {parameter.defaultValue}
                    </p>
                  ) : (
                    <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                      Required
                    </p>
                  )}
                </div>
              ),
            )}
        </div>
      )}
    />
  );
};

export default ParameterContainer;
