import { IconProps } from '../IconProps';

const JobOnHoldIcon = (props: IconProps) => (
  <svg
    role="img"
    focusable="false"
    viewBox="0 0 24 24"
    aria-label="Status On Hold"
    fill="#8e62bd"
    className={props.className}
  >
    <path
      fillRule="evenodd"
      d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M11,16 L9,16 L9,8 L11,8 L11,16 Z M15,16 L13,16 L13,8 L15,8 L15,16 Z"
    ></path>
  </svg>
);

export default JobOnHoldIcon;
