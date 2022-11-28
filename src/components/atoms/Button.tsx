import { ButtonHTMLAttributes } from 'react';

const styles: Record<string, { default: string, active: string, selected?: string }> = {
  dangerous: {
    default: 'bg-circle-red-dangerous text-white',
    active: 'hover:bg-circle-red-dangerous-dark',
  },
  secondary: {
    default: 'bg-circle-gray-250',
    active: 'hover:bg-circle-gray-300',
    selected: 'bg-circle-gray-400'
  },
  flat: {
    default: 'text-circle-gray-400',
    active: 'hover:bg-circle-gray-300 text-white',
  },
  primary: {
    default: 'bg-circle-blue text-white',
    active: 'hover:bg-circle-blue-dark',
  },
};

export type ButtonVariant = keyof typeof styles;

export const Button = ({
  variant,
  className,
  margin,
  selected,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
  margin?: string;
  selected?: boolean;
}) => {
  return (
    <button
      {...props}
      className={`${
        margin ? `mx-${margin}` : 'mx-3'
      } whitespace-nowrap text-sm font-medium py-2 px-4 duration:50 transition-colors rounded-md2 ${
        styles[variant].default
      }
      ${className}
      ${props.disabled ? 'opacity-50 cursor-default' : styles[variant].active}
      ${selected && styles[variant].selected}`}
    >
      {props.children}
    </button>
  );
};
