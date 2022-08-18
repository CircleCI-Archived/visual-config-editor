import { IconProps } from '../IconProps';

const MoreIcon = (props: IconProps) => (
  <svg width="18" height="4" viewBox="0 0 18 4" className={props.className}>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M14 2C14 3.10457 14.8954 4 16 4C17.1046 4 18 3.10457 18 2C18 0.89543 17.1046 0 16 0C14.8954 0 14 0.89543 14 2ZM7 2C7 3.10457 7.89543 4 9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 0 9 0C7.89543 0 7 0.89543 7 2ZM2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4Z"
      fill="#343434"
    />
  </svg>
);

export default MoreIcon;
