import { useField } from 'formik';
import { useState } from 'react';
import Switch from '../../../icons/ui/Switch';
import InspectorProperty from './InspectorProperty';
import ListProperty, { ListPropertyProps } from './ListProperty';

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
  const matrix = params?.matrix ? params.matrix[name] : undefined;
  const matrixField = useField(`${namePrefix}.matrix.${name}`);
  const defaultField = useField(`${namePrefix}.name`);
  const [inputDef, metaDef, helperDef] = defaultField;
  const [inputMatrix, metaMatrix, helperMatrix] = matrixField;
  const [isMatrix, setMatrix] = useState(matrix !== undefined);

  console.log(values);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMatrix(!isMatrix);
          console.log('yeeyey');
        }}
      >
        <Switch className="w-6 h-6" />
      </button>
      {isMatrix ? (
        <ListProperty
          label={label}
          name={
            namePrefix
              ? `${namePrefix}.matrix.parameters.${name}`
              : `matrix.parameters.${name}`
          }
          values={values}
          expanded
          addButton
          fieldprops={matrixField}
        />
      ) : (
        <InspectorProperty
          label={label}
          fieldprops={defaultField}
          name={namePrefix ? `${namePrefix}.${name}` : name}
        />
      )}
    </>
  );
};
