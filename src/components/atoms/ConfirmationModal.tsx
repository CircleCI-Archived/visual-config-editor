import { useEffect } from 'react';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import './new.css';

export type ConfirmationType = 'save' | 'delete';

export type ConfirmationDialogue = Record<
  ConfirmationType,
  { header: string; body: string; button: string; buttonClass: string }
>;

const confirmDialogue: ConfirmationDialogue = {
  save: {
    header: '',
    body: '',
    button: '',
    buttonClass: '',
  },
  delete: {
    header: 'Would you like to delete %s?',
    body: '',
    button: '',
    buttonClass: '',
  },
};

const ComfirmationModal = () => {
  const confirm = useStoreState((state) => state.confirm);
  const updateConfirmation = useStoreActions(
    (actions) => actions.updateConfirmation,
  );

  const dialogue = confirmDialogue[confirm?.type || 'save'];

  // implement dialog dictionary, make it pretty, functionality first bro, get components to delete
  return (
    <>
      {confirm && (
        <div className="dialog">
          <h3> {dialogue.header.replace('%s', 'step')}</h3>
          <p>{dialogue.body}</p>
          <div className="action-group">
            <button
              onClick={() => {
                confirm.onConfirm();
                updateConfirmation(undefined);
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                updateConfirmation(undefined);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ComfirmationModal;
