import { IconProps } from '../IconProps';

const MoreIcon = (props: IconProps) => (
  <svg viewBox="0 0 22 20" className={props.className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill={props.color}
    />
  </svg>
);

export default MoreIcon;
