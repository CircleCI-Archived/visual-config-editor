import React, { ReactChild, useEffect, useRef, useState } from 'react';

const DropdownContainer = (props: {
  className?: string;
  space?: number;
  children: ReactChild[] | ReactChild;
}) => {
  const [isExtended, setExtended] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !contentsRef.current) {
      return;
    }

    const main = buttonRef.current.getBoundingClientRect();
    const contents = contentsRef.current.getBoundingClientRect();

    setPos({
      left: main.x - contents.width + main.width,
      top: main.y + main.height + (props.space || 4),
    });

    // hide the box when a click event fires
    window.addEventListener('click', () => {
      setExtended(false);
    });
  }, [isExtended, props.space]);

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
