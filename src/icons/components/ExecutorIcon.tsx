import { IconProps } from '../IconProps';

const ExecutorIcon = (props: IconProps & { type?: string }) => (
  <svg viewBox="0 0 96 96" className={props.className} fill={props.color}>
    <g id="Layer_1" data-name="Layer 1">
      <path d="M85.93,30h-76a6,6,0,0,1-6-6V12a6,6,0,0,1,6-6h76a6,6,0,0,1,6,6V24A6,6,0,0,1,85.93,30Zm-76-20a2,2,0,0,0-2,2V24a2,2,0,0,0,2,2h76a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2Z" />
      <path d="M85.93,90h-76a6,6,0,0,1-6-6V72a6,6,0,0,1,6-6h76a6,6,0,0,1,6,6V84A6,6,0,0,1,85.93,90Zm-76-20a2,2,0,0,0-2,2V84a2,2,0,0,0,2,2h76a2,2,0,0,0,2-2V72a2,2,0,0,0-2-2Z" />
      <path d="M85.93,60h-76a6,6,0,0,1-6-6V42a6,6,0,0,1,6-6h76a6,6,0,0,1,6,6V54A6,6,0,0,1,85.93,60Zm-76-20a2,2,0,0,0-2,2V54a2,2,0,0,0,2,2h76a2,2,0,0,0,2-2V42a2,2,0,0,0-2-2Z" />
      <circle cx="19.93" cy="18" r="4" />
      <circle cx="19.93" cy="48" r="4" />
      <circle cx="19.93" cy="78" r="4" />
      <path d="M77.93,20h-48a2,2,0,0,1,0-4h48a2,2,0,0,1,0,4Z" />
      <path d="M77.93,50h-48a2,2,0,0,1,0-4h48a2,2,0,0,1,0,4Z" />
      <path d="M77.93,80h-48a2,2,0,0,1,0-4h48a2,2,0,0,1,0,4Z" />
    </g>
  </svg>
);

export default ExecutorIcon;
