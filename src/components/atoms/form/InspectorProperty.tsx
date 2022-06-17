import { Field, useField } from 'formik';
import { ReactElement, useEffect } from 'react';

export interface InspectorFieldProps {
  label: string;
  name: any;
  as?: string;
  type?: string;
  value?: any;
  hidden?: boolean;
  required?: boolean;
  onChange?: (e: any) => void;
  children?: ReactElement[] | ReactElement;
}

const InspectorProperty = ({ label, ...props }: InspectorFieldProps) => {
  const [field, meta, helper] = useField(props);

  // Sync form value to the prop value on mount
  useEffect(() => {
    if (props.value && meta.value !== props.value) {
      helper.setValue(props.value);
    }
  }, [props.value, helper, meta]);

  return (
    <div
      className={`${props.type === 'checkbox' && `flex flex-row`} mb-3`}
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
      <Field
        {...field}
        {...props}
        className={`${props.type !== 'checkbox' ? 'w-full' : 'ml-auto'} 
             border-circle-gray-300 border-2 rounded p-1 `}
      >
        {props.children}
      </Field>
    </div>
  );
};

export default InspectorProperty;
