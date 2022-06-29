import { useEffect } from 'react';
import { useStoreActions, useStoreState } from '../../state/Hooks';

const ToastContainer = () => {
  const toast = useStoreState((state) => state.toast);
  const clearToast = useStoreActions((actions) => actions.clearToast);

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
        </button>
      )}
    </>
  );
};

export default ToastContainer;
