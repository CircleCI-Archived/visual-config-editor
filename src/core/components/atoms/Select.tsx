import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik';
import React, { OptionHTMLAttributes, ReactElement, useState } from 'react';
import ExpandIcon from '../../icons/ui/ExpandIcon';
import DropdownContainer from '../containers/DropdownContainer';

type OptionElement = ReactElement<OptionHTMLAttributes<HTMLHtmlElement>>;

type SelectProps = {
  placeholder?: string;
  value?: any;
  className?: string;
  dropdownClassName?: string;
  onChange?: (value: any) => void;
  children: OptionElement[] | OptionElement;
  icon?: ReactElement;
  borderless?: boolean;
};

type SelectFieldProps = SelectProps & {
  name: string;
  field: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
  helper: FieldHelperProps<any>;
  transform?: (value: any) => any;
};

const SelectField = ({
  name,
  field,
  meta,
  helper,
  ...props
}: SelectFieldProps) => {
  const { value, initialValue } = meta;
  const { setValue } = helper;

  return (
    <Select
      {...field}
      {...props}
      value={value || initialValue}
      onChange={(value) => {
        setValue(props.transform ? props.transform(value) : value);

        props.onChange && props.onChange(value);
      }}
    />
  );
};

const Select = (props: SelectProps) => {
  const children = React.Children.toArray(props.children) as OptionElement[];
  const defaultSelected = children.findIndex(
    (child) => `${child.props.value}` === `${props.value}`,
  );
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <DropdownContainer
      className={`rounded ${
        props.borderless
          ? 'border-transparent'
          : ' border-circle-gray-300 shadow-sm'
      } px-2 hover:border-circle-gray-700 border
        ${props.className}`}
    >
      <div className="flex flex-row w-full">
        {props.icon}
        <div
          className={`${
            selected === -1 ? 'text-circle-gray-500' : 'text-circle-black'
          } ml-2 leading-10`}
        >
          {selected > -1
            ? children[selected].props.children
            : props.placeholder}
        </div>
        <div className="ml-auto py-2">
          <ExpandIcon className="w-3 h-5 mr-3 ml-3" expanded={true} />
        </div>
      </div>
      <div className={'bg-white py-2 shadow-lg flex flex-col ' + props.dropdownClassName}>
        {children.map((child, i) => {
          return (
            <button
              className={`px-3 py-1 text-left hover:bg-circle-gray-200 ${
                i > 0 && 'border-t border-circle-gray-300'
              }`}
              key={i}
              onClick={() => {
                setSelected(i);

                if (props.onChange) {
                  props.onChange(children[i].props.value);
                }
              }}
            >
              {child.props.children}
            </button>
          );
        })}
      </div>
    </DropdownContainer>
  );
};

export { Select, SelectField };
