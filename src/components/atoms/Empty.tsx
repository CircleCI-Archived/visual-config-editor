import { ReactElement } from 'react';
import { IconProps } from '../../icons/IconProps';

export type EmptyProps = {
  label: string;
  Logo?: React.FunctionComponent<IconProps>;
  description?: string | ReactElement;
};

export const Empty = ({ label, Logo, description }: EmptyProps) => {
  return (
    <>
      {Logo && <Logo className="w-6 h-6 mx-auto" color="#AAAAAA" />}
      <h1 className="text-lg font-bold text-center text-circle-gray-400 p-1">
        {label}
      </h1>
      {description && (
        <div className="text-sm text-center text-circle-gray-400">
          {description}
        </div>
      )}
    </>
  );
};
