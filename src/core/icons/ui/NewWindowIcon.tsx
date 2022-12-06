import { IconProps } from '../IconProps';

const NewWindowIcon = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={props.className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      fill={props.color}
      clipRule="evenodd"
      d="M20 15.6066C19.4477 15.6066 19 15.1589 19 14.6066V6.4142L9.70708 15.7071C9.31656 16.0976 8.68339 16.0976 8.29287 15.7071C7.90234 15.3166 7.90234 14.6834 8.29286 14.2929L17.5857 4.99998L8.99997 4.99998C8.44769 4.99999 7.99997 4.55227 7.99997 3.99998C7.99997 3.4477 8.44769 2.99999 8.99997 2.99999L20 2.99998C20.2652 2.99998 20.5195 3.10534 20.7071 3.29288C20.8946 3.48041 21 3.73477 21 3.99998V14.6066C21 15.1589 20.5522 15.6066 20 15.6066Z"
    />
  </svg>
);

export default NewWindowIcon;
