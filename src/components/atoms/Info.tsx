import { createRef, forwardRef, useRef } from 'react';
import InfoIcon from '../../icons/ui/InfoIcon';
import { useStoreActions } from '../../state/Hooks';

export const Info = ({ description }: { description: string }) => {
  const updateTooltip = useStoreActions((actions) => actions.updateTooltip);
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className="my-auto flex ml-1"
      onMouseEnter={() => {
        updateTooltip({ description, ref, facing: 'bottom'});
      }}
      onMouseLeave={() => updateTooltip(undefined)}
    >
      <InfoIcon className="w-5 p-1" color="#6A6A6A" />
    </div>
  );
};
