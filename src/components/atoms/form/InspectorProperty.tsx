import {
  Field,
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  useField,
} from 'formik';
import { ReactElement, useEffect } from 'react';
import { Info } from '../Info';
import { SelectField } from '../Select';

export type InspectorFieldProps = {
  label: string;
  name: any;
  as?: string;
  type?: string;
  value?: any;
  labelStyle?: string;
  hidden?: boolean;
  className?: string;
  required?: boolean;
  description?: string;
  beEmpty?: boolean;
  placeholder?: string;
  transform?: (value: any) => any;
  onChange?: (e: any) => void;
  children?: ReactElement[] | ReactElement;
  dependent?: (value: any) => ReactElement;
  pinned?: ReactElement;
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
        border rounded p-2 px-4 shadow-sm hover:border-circle-black placeholder-circle-gray-500 ${
          !field.value && 'bg-circle-gray-100'
        } ${error ? 'border-circle-red' : 'border-circle-gray-300'}`}
      ></Field>
    )
  );
};

const InspectorProperty = (props: InspectorFieldProps) => {
  const field = useField(props);
  return <FieldlessInspectorProperty {...props} field={field} />;
};

export const FieldlessInspectorProperty = ({
  label,
  field,
  description,
  pinned,
  ...props
}: InspectorFieldProps & {
  field: [FieldInputProps<any>, FieldMetaProps<any>, FieldHelperProps<any>];
}) => {
  const [input, meta, helper] = field;
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
        className={`${props.type === 'checkbox' && `flex flex-row`} mb-4 ${
          props.className
        }`}
        hidden={props.hidden}
      >
        <div className={`flex flex-row mb-2 ${props.labelStyle}`}>
          <h3 className="font-medium text-sm my-auto text-circle-black">
            {label}
          </h3>
          {description && <Info description={description} />}
          <div className="ml-auto ">
            {props.required && (
              <span className="leading-5 text-xs text-circle-black px-2 bg-circle-gray-300 rounded-full font-medium">
                required
              </span>
            )}
            {pinned}
          </div>
        </div>
        {getField(props, input, meta, helper, error)}
        {touched && error && (
          <span className="text-sm text-circle-red">{error}</span>
        )}
      </div>
      {props.dependent && props.dependent(value)}
    </>
  );
};

export default InspectorProperty;
