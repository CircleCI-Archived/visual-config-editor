import { useEffect } from 'react';
import { useStoreActions, useStoreState } from '../../state/Hooks';

const Toast = () => {
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
        <div className="p-6">
          <div
            className={
              'flex flex-row text-white bg-circle-gray-700 p-3 w-full transition-opacity rounded'
            }
          >
            <p className="font-bold mx-2 overflow-ellipsis overflow-x-hidden whitespace-nowrap my-auto">
              {toast?.label}
            </p>
            <p className="my-auto">{toast?.content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
