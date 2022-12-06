import { IconProps } from '../IconProps';
import CircleLogo from './CircleCI';

const Loading = (props: IconProps) => (
  <div className={`flex flex-row ${props.className} w-36 h-6`}>
    <CircleLogo className="my-auto" />
    <h3 className="font-bold px-2">Loading</h3>

    <span className="border-r mx-2 py-3"></span>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="my-auto animate-spin-slow"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.47715 6.47715 2 12 2V12V22C6.47715 22 2 17.5228 2 12Z"
        fill="#B6E6FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22V2C17.5228 2 22 6.47715 22 12Z"
        fill="#0078CA"
      />
    </svg>
  </div>
);

export default Loading;
