import { IconProps } from '../IconProps';

const InfoIcon = (props: IconProps) => (
  <svg viewBox="0 0 20 20" className={props.className} fill={props.color}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1.81818C5.4839 1.81818 1.81818 5.4839 1.81818 10C1.81818 14.5161 5.4839 18.1818 10 18.1818C14.5161 18.1818 18.1818 14.5161 18.1818 10C18.1818 5.4839 14.5161 1.81818 10 1.81818ZM0 10C0 4.47974 4.47974 0 10 0C15.5203 0 20 4.47974 20 10C20 15.5203 15.5203 20 10 20C4.47974 20 0 15.5203 0 10ZM10 4.54546C9.49796 4.54546 9.09094 4.95248 9.09094 5.45455C9.09094 5.95663 9.49796 6.36364 10 6.36364C10.5021 6.36364 10.9091 5.95663 10.9091 5.45455C10.9091 4.95248 10.5021 4.54546 10 4.54546ZM10 8.18182C9.49796 8.18182 9.09094 8.58883 9.09094 9.09091V14.5455C9.09094 15.0475 9.49796 15.4545 10 15.4545C10.5021 15.4545 10.9091 15.0475 10.9091 14.5455V9.09091C10.9091 8.58883 10.5021 8.18182 10 8.18182Z"
      fill="#161616"
    />
  </svg>
);

export default InfoIcon;
