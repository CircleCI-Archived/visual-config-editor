import { FieldArray, useField } from 'formik';
import ParameterIcon from '../../icons/components/ParameterIcon';
import { ParameterMapping } from '../../mappings/components/ParameterMapping';
import GenerableMapping from '../../mappings/GenerableMapping';
import { useStoreActions } from '../../state/Hooks';
import AddButton from '../atoms/AddButton';
import { Button } from '../atoms/Button';
import { Empty } from '../atoms/Empty';
import {
  InspectorDefinitionMenu,
  InspectorDefinitionMenuNav,
} from '../menus/definitions/InspectorDefinitionMenu';
import { navSubTypeMenu } from '../menus/SubTypeMenu';
const ParameterContainer = (props: {
  dataMapping: GenerableMapping;
  values: any;
}) => {
  const [field] = useField(props.values.parameters);
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const entries: [string, unknown][] =
    props.values.parameters && Object.entries(props.values.parameters);

  return (
    <FieldArray
      {...field}
      name="parameters"
      render={(_) => (
        <div className="p-6 flex flex-col">
          <AddButton
            type="button"
            className="mx-auto mb-4"
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
          >
            Add Parameter
          </AddButton>
          {entries?.length > 0 ? (
            entries.map(([name, parameter]: [string, any], index) => (
              <button
                key={name}
                className="p-4 mb-4 w-full border-circle-gray-300 border hover:border-circle-black rounded text-left hover:border-circle-black"
                onClick={() => {
                  navigateTo({
                    component: InspectorDefinitionMenuNav,
                    props: {
                      dataType: ParameterMapping,
                      passBackKey: 'parameters',
                      index,
                      subtype: parameter.type,
                      editing: true,
                      values: { name, ...parameter },
                      source: props.values.parameters
                        ? Object.keys(props.values.parameters)
                        : undefined,
                    },
                    values: props.values,
                  });
                }}
              >
                <div className="flex">
                  <p className="font-bold">{name}</p>
                </div>
                {parameter.description && (
                  <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                    {parameter.description}
                  </p>
                )}
                {parameter.default ? (
                  <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                    {parameter.default}
                  </p>
                ) : (
                  <p className="text-sm mt-1 leading-4 whitespace-pre-wrap text-circle-gray-500">
                    Required
                  </p>
                )}
              </button>
            ))
          ) : (
            <Empty
              label="No Parameters Yet"
              Logo={ParameterIcon}
              description="Add a parameter by clicking the button above 
              to implement dynamic functionality."
            />
          )}
        </div>
      )}
    />
  );
};

export default ParameterContainer;
