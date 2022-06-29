import React, { useState } from 'react';
import { useEffect } from 'react';
import DeleteItemIcon from '../../icons/ui/DeleteItemIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';

const ToastContainer = () => {
  const toast = useStoreState((state) => state.toast);
  const clearToast = useStoreActions((actions) => actions.clearToast);
  const [hover, setHover] = useState(false);

  const handleMouseIn = () => {
    setHover(true);
  };

  const handleMouseOut = () => {
    setHover(false);
  };
  useEffect(() => {
    setTimeout(() => {
      clearToast();
    }, 3500);
  }, [toast, clearToast]);
  return (
    <>
      {toast && (
        <button
          type="button"
          className=" flex flex-row text-white text-sm font-small m-7 p-2 w-60 bg-black duration:50 transition-all rounded-md2"
        >
          <p className="font-bold mx-1">{toast?.label} </p>{' '}
          <p>{toast?.content}</p>
          <button
            type="button"
            onClick={() => {
              clearToast();
            }}
            onMouseOver={handleMouseIn}
            onMouseOut={handleMouseOut}
          >
            <DeleteItemIcon
              className="my-2 mx-28 w-2 cursor-pointer m-auto"
              color={hover ? 'red' : 'black'}
            />
          </button>
        </button>
      )}
    </>
  );
};

export default ToastContainer;
