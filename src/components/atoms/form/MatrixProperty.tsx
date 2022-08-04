import { FieldArray, useField } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Switch from '../../../icons/ui/Switch';
import InspectorProperty, {
  FieldlessInspectorProperty,
} from './InspectorProperty';
import ListProperty, {
  FieldlessListProperty,
  ListPropertyProps,
} from './ListProperty';

export type MatrixPropertyProps = ListPropertyProps & {
  namePrefix?: string;
};

export const MatrixSwitch = () => {
  return (
    <button>
      <Switch className="w-6 h-6" />
    </button>
  );
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

  console.log(matrix, isMatrix);

  const callback = useCallback(() => {
    if (isMatrix) {
      console.log(inputMatrix.value, inputDef.value, 'a');
      helperDef.setValue(inputMatrix.value ? inputMatrix.value[0] : '');
      helperMatrix.setValue(undefined);
      console.log(inputMatrix.value, inputDef.value, 'b');
    } else {
      console.log(inputMatrix.value, inputDef.value, 'c');
      helperMatrix.setValue([inputDef.value ?? '']);
      helperDef.setValue(undefined);
      console.log(inputMatrix.value, inputDef.value, 'd');
    }
    setMatrix(!isMatrix);
  }, [inputDef.value, inputMatrix.value, helperDef, helperMatrix, isMatrix]);

  const setValue = helperMatrix.setValue;

  useEffect(() => {
    if (matrix && matrix !== inputMatrix.value) {
      setValue(matrix);
    }
  }, [matrix, setValue, inputMatrix]);

  return (
    <>
      <button
        type="button"
        onClick={callback}
        className="hover:bg-circle-gray-300 p-1 rounded transition-colors"
      >
        <Switch className="w-6 h-6" />
      </button>
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
              label={label}
              name={
                namePrefix
                  ? `${namePrefix}.matrix.parameters.${name}`
                  : `matrix.parameters.${name}`
              }
              arrayHelper={arrayHelper}
              values={values}
              expanded
              addButton
              field={matrixField}
            />
          )}
        />
      ) : (
        <FieldlessInspectorProperty
          label={label}
          name={namePrefix ? `${namePrefix}.${name}` : name}
          field={defaultField}
        />
      )}
    </>
  );
};
