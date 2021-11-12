import { FieldArray } from 'formik';
import { ReactElement } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DeleteItemIcon from '../../../icons/ui/DeleteItemIcon';
import DragListIcon from '../../../icons/ui/DragItemIcon';
import { useStoreActions } from '../../../state/Hooks';
import CollapsibleList from '../../containers/CollapsibleList';
import { InspectorPropertyProps } from './InspectorProperty';

export type ListPropertyProps = InspectorPropertyProps & {
  titleExpanded?: ReactElement;
  values?: any;
  description?: string;
  emptyText?: string;
}

const ListProperty = (props: ListPropertyProps) => {
  return (
    <CollapsibleList
      title={props.label}
      titleExpanded={props.titleExpanded}
    >
      {props.values?.length > 0 ? (
        <FieldArray
          name="steps"

          render={(arrayHelper) => (
            <DragDropContext
              onDragEnd={(result) => {
                if (result.destination) {
                  arrayHelper.move(
                    result.source.index,
                    result.destination.index,
                  );
                }
              }}
            >
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-2"
                  >
                    {props.values?.map((cmd: any, index: number) => (
                      <Draggable
                        key={index}
                        draggableId={`${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <button
                            className="w-full mb-2 p-1 px-3 text-sm cursor-pointer text-left text-circle-black 
                      bg-white border border-circle-gray-300 rounded-md2 flex flex-row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            type="button"
                          >
                            <p className="leading-6">{cmd.name}</p>
                            <div
                              className="ml-auto mr-3"
                              {...provided.dragHandleProps}
                            >
                              <DragListIcon
                                className="w-4 h-6 py-1"
                                color="#AAAAAA"
                              />
                            </div>
                            <button
                              onClick={() => {
                                arrayHelper.remove(index);
                              }}
                              type="button"
                              className="my-auto"
                            >
                              <DeleteItemIcon
                                className="w-3 h-3"
                                color="#AAAAAA"
                              />
                            </button>
                          </button>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        />
      ) : (
        <p className="ml-2 font-medium text-sm text-circle-gray-500">
          {props.emptyText}
        </p>
      )}
    </CollapsibleList>
  );
};

export default ListProperty;
