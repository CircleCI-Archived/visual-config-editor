import { FieldArray, useField } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Switch from '../../../icons/ui/Switch';
import { FieldlessInspectorProperty } from './InspectorProperty';
import { FieldlessListProperty, ListPropertyProps } from './ListProperty';

export type MatrixPropertyProps = ListPropertyProps & {
  namePrefix?: string;
};

export const MatrixProperty = ({
  name,
  namePrefix,
  values,
  label,
  ...props
}: MatrixPropertyProps) => {
  const params = values.parameters;
  const matrix = useMemo(
    () => (params?.matrix ? params.matrix.parameters[name] : undefined),
    [params, name],
  );
  const matrixField = useField({
    ...props,
    name: namePrefix
      ? `${namePrefix}.matrix.${name}`
      : `matrix.parameters.${name}`,
  });
  const defaultField = useField({
    ...props,
    name: namePrefix ? `${namePrefix}.${name}` : name,
  });
  const [inputDef, , helperDef] = defaultField;
  const [inputMatrix, , helperMatrix] = matrixField;
  const [isMatrix, setMatrix] = useState(matrix !== undefined);

  const setValue = helperMatrix.setValue;

  useEffect(() => {
    if (matrix && matrix !== inputMatrix.value) {
      setValue(matrix);
    }
  }, [matrix, setValue, inputMatrix]);

  const callback = useCallback(() => {
    if (isMatrix) {
      helperDef.setValue(inputMatrix.value ? inputMatrix.value[0] : '');
      helperMatrix.setValue(undefined);
    } else {
      helperMatrix.setValue([inputDef.value ?? '']);
      helperDef.setValue(undefined);
    }
    setMatrix(!isMatrix);
  }, [inputDef.value, inputMatrix.value, helperDef, helperMatrix, isMatrix]);

  const switchButton = useMemo(
    () => (
      <button
        type="button"
        onClick={callback}
        className="hover:bg-circle-gray-400 bg-circle-gray-300 p-1 rounded transition-colors w-8 h-8 ml-2"
      >
        <Switch className="w-5 h-5 m-auto" />
      </button>
    ),
    [callback],
  );

  return (
    <>
      {isMatrix ? (
        <FieldArray
          {...matrixField}
          name={
            namePrefix
              ? `${namePrefix}.matrix.parameters.${name}`
              : `matrix.parameters.${name}`
          }
          render={(arrayHelper) => (
            <FieldlessListProperty
              {...props}
              description={props.description}
              label={label}
              titleFont="font-medium text-sm"
              name={
                namePrefix
                  ? `${namePrefix}.matrix.parameters.${name}`
                  : `matrix.parameters.${name}`
              }
              arrayHelper={arrayHelper}
              values={values}
              expanded
              addButton
              pinned={switchButton}
              field={matrixField}
            />
          )}
        />
      ) : (
        <FieldlessInspectorProperty
          {...props}
          label={label}
          labelStyle="h-8"
          description={props.description}
          name={namePrefix ? `${namePrefix}.${name}` : name}
          field={defaultField}
          pinned={switchButton}
        />
      )}
    </>
  );
};
