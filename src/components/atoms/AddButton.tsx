import { ButtonHTMLAttributes } from 'react';
import AddIcon from '../../icons/ui/AddIcon';

const AddButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button

      type="button"
      {...props}
      className={
        `bg-circle-gray-300 transition-colors h-8 w-8 rounded ${props.className} 
      ${props.disabled ? 'opacity-50 cursor-default' : 'hover:bg-circle-gray-400 '}`
      }
    >
      <AddIcon className="m-auto"></AddIcon>
    </button>
  );
};

export default AddButton;
