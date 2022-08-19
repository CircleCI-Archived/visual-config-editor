import { useStoreState, useStoreActions } from '../../state/Hooks';
import { Button } from './Button';

const Toast = () => {
  const toast = useStoreState((state) => state.toast);
  const setToast = useStoreActions((actions) => actions.setToast);

  return (
    <>
      {toast && (
        <Button
          title={toast?.label}
          className={
            'flex flex-row text-white bg-circle-gray-700 p-3 w-full rounded transition-opacity'
          }
          ariaLabel={toast?.label}
          onClick={() => {
            setToast();
          }}
        >
          <p className="font-bold mx-2 overflow-ellipsis overflow-x-hidden whitespace-nowrap my-auto">
            {toast?.label}
          </p>
          <p className="my-auto">{toast?.content}</p>
        </Button>
      )}
    </>
  );
};

export default Toast;
