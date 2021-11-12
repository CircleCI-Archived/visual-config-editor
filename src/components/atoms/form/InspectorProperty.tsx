import { Field } from 'formik';
import { type } from 'os';
import { ReactElement } from 'react';

export interface InspectorPropertyProps {
  name: any;
  label: string;
  as?: string;
  type?: string;
  required?: boolean;
  children?: ReactElement[] | ReactElement;
}

const InspectorProperty = (props: InspectorPropertyProps) => {
  return (
    <div className={`${props.type == 'checkbox' && `flex flex-row`} mb-3`}>
      <div className="flex flex-row">
        <p className="font-bold leading-5 tracking-wide">{props.label}</p>
        {props.required && (
          <span className="ml-auto tracking-wide leading-6 text-sm text-circle-blue font-medium">
            Required
          </span>
        )}
      </div>
      <Field
        name={props.name}
        as={props.as}
        type={props.type}
        required={props.required}
        className={`${props.type != 'checkbox' ? 'w-full' : 'ml-auto'} 
             border-circle-gray-300 border-2 rounded p-1 `}
      >
        {props.children}
      </Field>
    </div>
  );
};

export default InspectorProperty;
