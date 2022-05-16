import { MutableRefObject } from 'react';
import InfoIcon from '../../icons/ui/InfoIcon';
import { useStoreState } from '../../state/Hooks';
import ToolTip from '../atoms/Tooltip';

export interface GuideContainerProps {
  target: MutableRefObject<any>;
  children: string;
}

const GuideContainer = (props: GuideContainerProps) => {
  const guideStep = useStoreState((state) => state.guideStep);

  return (
    <ToolTip target={props.target}>
      <div className="w-80 p-4 bg-white drop-shadow-lg rounded-lg">
        <div className="flex flex-row">
          <InfoIcon className="w-5 h-5" color="#000000"></InfoIcon>
          <div className="px-3 w-full">
            <header className="pb-3 font-bold leading-5">
              Step {guideStep} of 3
            </header>
            <div className="font-medium text-sm text-circle-gray-500 whitespace-pre-line">
              {props.children}
            </div>
            <div className="w-full flex flex-row pt-2">
              <button className=" ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolTip>
  );
};

export default GuideContainer;
