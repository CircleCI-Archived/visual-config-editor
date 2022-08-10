import { ButtonHTMLAttributes } from 'react';

const styles = {
  dangerous:
    'bg-circle-red-dangerous hover:bg-circle-red-dangerous-dark text-white',
  secondary: 'bg-circle-gray-250 hover:bg-circle-gray-300 text-circle-gray',
  primary: 'bg-circle-blue hover:bg-circle-blue-dark text-white',
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
        styles[variant]
      }`}
    >
      {props.children}
    </button>
  );
};
