import { ButtonHTMLAttributes } from 'react';

const styles = {
  dangerous: {
    default: 'bg-circle-red-dangerous text-white',
    active: 'hover:bg-circle-red-dangerous-dark ',
  },
  secondary: {
    default: 'bg-circle-gray-250',
    active: 'hover:bg-circle-gray-300',
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
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
  margin?: string;
}) => {
  return (
    <button
      {...props}
      className={`${className} ${
        margin ? `mx-${margin}` : 'mx-3'
      } w-min h-min whitespace-nowrap text-sm font-medium py-2 px-4 duration:50 transition-colors rounded-md2 ${
        styles[variant].default
      }
      ${props.disabled ? 'opacity-50 cursor-default' : styles[variant].active}`}
    >
      {props.children}
    </button>
  );
};
