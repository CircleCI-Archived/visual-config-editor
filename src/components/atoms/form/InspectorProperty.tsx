import {
  Field,
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  useField,
} from 'formik';
import { ReactElement, useEffect } from 'react';
import { SelectField } from '../Select';

export type InspectorFieldProps = {
  label: string;
  name: any;
  as?: string;
  type?: string;
  value?: any;
  hidden?: boolean;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (e: any) => void;
  children?: ReactElement[] | ReactElement;
  dependent?: (value: any) => ReactElement;
};

const getField = (
  props: Partial<InspectorFieldProps>,
  field: FieldInputProps<any>,
  meta: FieldMetaProps<any>,
  helper: FieldHelperProps<any>,
  error?: string,
) => {
  if (props.children && props.as === 'select') {
    return (
      <SelectField
        {...props}
        name={props.name}
        meta={meta}
        field={field}
        helper={helper}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={'w-full ' + props.className}
      >
        {props.children}
      </SelectField>
    );
  }

  return (
    props.children ?? (
      <Field
        {...field}
        {...props}
        className={`${props.type !== 'checkbox' ? 'w-full' : 'ml-auto'} 
        border-2 rounded p-1 ${
          error ? 'border-circle-red' : 'border-circle-gray-300'
        }`}
      ></Field>
    )
  );
};

const InspectorProperty = ({ label, ...props }: InspectorFieldProps) => {
  const [field, meta, helper] = useField(props);
  const { touched, error, value } = meta;

  // Sync form value to the prop value on mount
  useEffect(() => {
    if (props.value && value !== props.value) {
      helper.setValue(props.value);
    }
  }, [helper, value, props.value]);

  return (
    <>
      <div
        className={`${props.type === 'checkbox' && `flex flex-row`} mb-3 ${
          props.className
        }`}
        hidden={props.hidden}
      >
        <div className="flex flex-row mb-2">
          <p className="font-bold leading-5 tracking-wide">{label}</p>
          {props.required && (
            <span className="ml-auto tracking-wide leading-6 text-sm text-circle-gray-400 font-medium">
              Required
            </span>
          )}
        </div>
        {getField(props, field, meta, helper, error)}
        {touched && error && (
          <span className="text-sm text-circle-red">{error}</span>
        )}
      </div>
      {props.dependent && props.dependent(value)}
    </>
  );
};

export default InspectorProperty;
