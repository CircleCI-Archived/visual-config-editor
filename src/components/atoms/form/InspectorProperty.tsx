import { Field, FieldInputProps, useField } from 'formik';
import React, { ReactElement, useEffect } from 'react';
import Select from '../Select';

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
};

const getField = (
  props: Partial<InspectorFieldProps>,
  field: FieldInputProps<any>,
  error?: string,
) => {
  if (props.children && props.as === 'select') {
    return (
      <Select
        value={props.value}
        placeholder={props.placeholder}
        className={props.className}
      >
        {props.children}
      </Select>
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
      {getField(props, field, error)}
      {touched && error && (
        <span className="text-sm text-circle-red">{error}</span>
      )}
    </div>
  );
};

export default InspectorProperty;
