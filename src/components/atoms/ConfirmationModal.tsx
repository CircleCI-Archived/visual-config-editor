import { useEffect } from 'react';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import './new.css';
const ComfirmationModal = () => {
  // const toast = useStoreState((state) => state.toast);
  // const clearToast = useStoreActions((actions) => actions.clearToast);

  // useEffect(() => {
  //   setTimeout(() => {
  //     clearToast();
  //   }, 3500);
  // }, [toast, clearToast]);

  return (
    <div className="dialog">
      <h3>Delete Post</h3>
      <p>Are you sure you want to delete the selected post?</p>
      <div className="action-group">
        <button>Delete</button>
        <button>Cancel</button>
      </div>
    </div>
  );
};

export default ComfirmationModal;
