import { useEffect } from 'react';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { Button } from './Button';
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
    header: 'Are you sure?',
    body: 'Do you really want to delete this definition? This process cannot be undone.',
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
        <div
          className="absolute left-0 top-0 w-full h-full z-50"
          style={{ background: 'rgba(0,0,0,.5)' }}
        >
          <div className="dialog">
            <h3> {dialogue.header.replace('%s', 'step')}</h3>
            <p>{dialogue.body}</p>
            <div className="action-group">
              <Button
                variant="secondary"
                onClick={() => {
                  updateConfirmation(undefined);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="dangerous"
                onClick={() => {
                  confirm.onConfirm();
                  updateConfirmation(undefined);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComfirmationModal;
