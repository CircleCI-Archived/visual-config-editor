import React, { ReactChild, useEffect, useRef, useState } from 'react';

const DropdownContainer = (props: {
  className?: string;
  children: ReactChild[] | ReactChild;
}) => {
  const [isExtended, setExtended] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePos = () => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    setPos({ left: rect.x, top: rect.y + rect.height });
  };

  useEffect(() => {
    updatePos();

    // hide the box when a click event fires
    window.addEventListener(
      'click',
      () => {
          setExtended(false);
      },
    );
  }, [isExtended]);

  return (
    <>
      <button
        className={props.className}
        ref={buttonRef}
        onClick={(event) => {
          setExtended(!isExtended);
          // prevent the click event from bubbling up to event that will close the drawer
          event.stopPropagation();
        }}
      >
        •••
      </button>
      {isExtended && (
        <div className="fixed w-max h-max z-20 flex flex-col" style={pos}>
          {React.Children.toArray(props.children)}
        </div>
      )}
    </>
  );
};

export default DropdownContainer;
