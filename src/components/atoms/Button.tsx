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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  variant?: ButtonVariant;
  title: string;
  margin?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button = ({
  variant,
  ariaLabel,
  className,
  title,
  margin,
  ref,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
  const sDefault = variant ? styles[variant].default : '';
  const sActive = variant ? styles[variant].active : '';
  return (
    <button
      {...props}
      title={title}
      {... ref ? { ref } : {}}
      aria-label={ariaLabel}
      className={`${className} w-min h-min p-2 mx-2 whitespace-nowrap text-sm font-medium duration:50 transition-colors rounded-md2 ${sDefault}
      ${props.disabled ? 'opacity-50 cursor-default' : sActive}`}
    >
      {props.children}
    </button>
  );
};
