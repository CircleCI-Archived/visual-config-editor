import { useStoreState } from '../../state/Hooks';

const Toast = () => {
  const toast = useStoreState((state) => state.toast);

  return (
    <>
      {toast && (
        <div
          className={
            'flex flex-row z-1 text-white bg-circle-gray-700 p-3 w-full rounded transition-opacity'
          }
          aria-label={toast?.label}
        >
          <p className="font-bold mx-2 overflow-ellipsis overflow-x-hidden whitespace-nowrap my-auto">
            {toast?.label}
          </p>
          <p className="my-auto">{toast?.content}</p>
          {toast.link && (
            <a
              className="text-circle-blue-light ml-auto font-medium"
              href={toast.link.url}
              target="circleci_issue"
            >
              {toast.link.label}
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default Toast;
