import { useCallback, useEffect } from 'react';
import { FocusScope } from 'react-aria';
import DeleteItemIcon from '../../icons/ui/DeleteItemIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { Button, ButtonVariant } from '../atoms/Button';

export type ConfirmationType = 'save' | 'delete';
export type ConfirmationDialogue = {
  header: string;
  body: string;
  button: string;
  buttonVariant: ButtonVariant;
};

export type ConfirmationModalModel = {
  modalDialogue: ConfirmationType | ConfirmationDialogue;
  labels: string[];
  onConfirm: () => void;
};

export type ConfirmationDialogueTemplates = Record<
  ConfirmationType,
  ConfirmationDialogue
>;

const placeholder = '%s';
const confirmDialogue: ConfirmationDialogueTemplates = {
  save: {
    header: `Do you want to save changes to ${placeholder}?`,
    body: 'If you choose not to save, your changes will be lost.',
    button: 'Save',
    buttonVariant: 'primary',
  },
  delete: {
    header: `Delete ${placeholder} ${placeholder}?`,
    body: `When you delete the ${placeholder} named ${placeholder}, it will be removed from each component that uses it.
    This definition has %s dependent components.`,
    button: 'Delete',
    buttonVariant: 'dangerous',
  },
};

const ConfirmationModal = () => {
  const confirm = useStoreState((state) => state.confirm);
  const updateConfirmation = useStoreActions(
    (actions) => actions.triggerConfirmation,
  );

  const dialogue =
    typeof confirm?.modalDialogue === 'string'
      ? confirmDialogue[confirm.modalDialogue]
      : confirm?.modalDialogue;
  const dialogueBox = { x: 478, y: 250 }; // TODO: make this dynamic

  const closeHandler = useCallback(() => {
    updateConfirmation(undefined);
  }, [updateConfirmation]);

  const handleUserKeyPress = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'Escape') {
        closeHandler();
      }
    },
    [closeHandler],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  /**
   * Replace placeholders in the dialogue body with the provided confirmation values.
   */
  const populatePlaceholders = (input: string) => {
    const parts = input.split(placeholder);

    return parts.map((part, index) => (
      <>
        {part}
        {index !== parts.length - 1 && (
          <strong>{confirm?.labels[index]}</strong>
        )}
      </>
    ));
  };

  // implement dialog dictionary, make it pretty, functionality first bro, get components to delete
  return (
    <>
      {confirm && dialogue && (
        <div
          aria-label="Confirmation Modal"
          className="absolute left-0 top-0 w-full h-full z-50 flex"
          style={{ background: 'rgba(20,20,20,.8)' }}
        >
          <FocusScope contain autoFocus>
            <div
              className="bg-white w-min rounded absolute"
              style={{
                left: `calc(50% - ${dialogueBox.x / 2}px`,
                top: `calc(50% - ${dialogueBox.y / 2}px`,
              }}
            >
              <div className="px-8 py-4">
                <h3 className="font-extrabold py-4 text-2xl">
                  {populatePlaceholders(dialogue.header)}
                </h3>
                <div className="w-96 h-20 pt-2">
                  {populatePlaceholders(dialogue.body)}
                </div>
              </div>
              <div className="border-t border-circle-gray-400 p-4 py-6 flex">
                <div className="ml-auto">
                  <Button
                    title='Cancel'
                    ariaLabel="Cancel"
                    variant="secondary"
                    type="button"
                    onClick={closeHandler}
                  >
                    Cancel
                  </Button>
                  <Button
                    title={dialogue.button}
                    ariaLabel={dialogue.button}
                    variant={dialogue.buttonVariant}
                    type="button"
                    onClick={() => {
                      confirm.onConfirm();
                      updateConfirmation(undefined);
                    }}
                  >
                    {dialogue.button}
                  </Button>
                </div>
                <Button
                  title='Delete'
                  ariaLabel='Delete'
                  className="absolute w-14 h-10 top-0 right-0 hover:bg-circle-gray-300 rounded"
                  onClick={closeHandler}
                >
                  <DeleteItemIcon
                    className="m-auto w-3 h-3"
                    color="#555555"
                  ></DeleteItemIcon>
                </Button>
              </div>
            </div>
          </FocusScope>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;
