import { PropsWithChildren } from 'react';
import { inspectorWidth } from '../../App';

export const Footer = ({
  children,
  centered,
  className,
}: PropsWithChildren<any> & { centered?: boolean }) => {
  return (
    <footer
      className={`absolute bottom-0 flex flex-row right-0 py-6 bg-white border-t border-circle-gray-300 ${className}`}
      style={{ width: inspectorWidth }}
    >
      <div className={`flex ${centered ? 'mx-auto' : 'ml-auto'}`}>
        {children}
      </div>
    </footer>
  );
};
