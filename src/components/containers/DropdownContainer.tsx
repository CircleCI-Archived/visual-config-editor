import React, {
  ReactChild,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const getDropDownStyle = (
  buttonRef: RefObject<HTMLButtonElement>,
  contentsRef: RefObject<HTMLDivElement>,
  alignLeft?: boolean,
  padding?: number,
) => {
  if (!buttonRef.current || !contentsRef.current) {
    return {
      left: 0,
      top: 0,
      minWidth: 0,
    };
  }

  const main = buttonRef.current?.getBoundingClientRect();
  const contents = contentsRef.current?.getBoundingClientRect();

  return {
    left: main.x + (alignLeft ? -contents.width + main.width : 0),
    top: main.y + main.height + (padding || 4),
    minWidth: main.width,
  };
};

const DropdownContainer = (props: {
  className?: string;
  space?: number;
  alignLeft?: boolean;
  dontCollapse?: boolean;
  onClick?: () => void;
  children: ReactChild[] | ReactChild;
}) => {
  const [isExtended, setExtended] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(
    getDropDownStyle(buttonRef, contentsRef, props.alignLeft, props.space),
  );

  const clickListener = useCallback(() => {
    setExtended(false);
  }, []);

  useEffect(() => {
    setPos(
      getDropDownStyle(buttonRef, contentsRef, props.alignLeft, props.space),
    );

    if (!props.dontCollapse) {
      window.addEventListener('click', clickListener);

      return () => {
        window.removeEventListener('click', clickListener);
      };
    }
  }, [
    isExtended,
    clickListener,
    props.alignLeft,
    props.space,
    props.dontCollapse,
  ]);

  const [first, ...children] = React.Children.toArray(props.children);

  return (
    <>
      <button
        className={props.className}
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          setExtended(!isExtended);
          // prevent the click event from bubbling up to event that will close the drawer
          event.stopPropagation();
          props.onClick && props.onClick();
        }}
      >
        {first}
      </button>
      {isExtended && (
        <div
          ref={contentsRef}
          className="fixed w-max h-max z-20 flex flex-col"
          style={pos}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default DropdownContainer;
