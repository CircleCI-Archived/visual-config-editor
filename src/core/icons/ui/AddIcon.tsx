import { IconProps } from '../IconProps';

const AddIcon = (props: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className={props.className}
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 7V1C7 0.447715 7.44772 0 8 0C8.55229 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55229 15.5523 9 15 9H9V15C9 15.5523 8.55229 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55229 0 8C0 7.44772 0.447715 7 1 7H7Z"
      fill="#343434"
    />
  </svg>
);

export default AddIcon;
