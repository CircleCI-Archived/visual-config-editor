import { PropsWithChildren } from 'react';
import { inspectorWidth } from '../../App';

export const Footer = (props: PropsWithChildren<any>) => {
  return (
    <footer
      className={`absolute bottom-0 flex flex-row right-0 ml-auto py-6 bg-white border-t border-circle-gray-300 ${props.className}`}
      style={{ width: inspectorWidth }}
    >
      <div className="flex ml-auto">{props.children}</div>
    </footer>
  );
};
