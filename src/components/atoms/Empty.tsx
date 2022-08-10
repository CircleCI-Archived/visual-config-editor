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
      <div>
        {Logo && <Logo className="w-5 h-5 mx-auto" color="#161616" />}
        <h2 className="text-sm font-bold text-center p-1">{label}</h2>
        {description && (
          <div className="text-sm text-center ">{description}</div>
        )}
      </div>
    </>
  );
};
