import {
  Field,
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  useField,
} from 'formik';
import { ReactElement, useEffect } from 'react';
import InfoIcon from '../../../icons/ui/InfoIcon';
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
  beEmpty?: boolean;
  placeholder?: string;
  transform?: (value: any) => any;
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
        transform={props.transform}
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
        border rounded p-1 hover:border-circle-black ${
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
          <p className="font-medium text-sm my-auto tracking-wide text-circle-black">
            {label}
          </p>
          <InfoIcon className="w-5 flex my-auto p-1" color="#6A6A6A" />
          {props.required && (
            <span className="ml-auto tracking-wide leading-5 text-xs text-circle-black px-2 bg-circle-gray-300 rounded-full font-medium">
              required
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
