import { FieldArray, useField } from 'formik';
import { ReactElement } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DeleteItemIcon from '../../../icons/ui/DeleteItemIcon';
import DragListIcon from '../../../icons/ui/DragItemIcon';
import CollapsibleList from '../../containers/CollapsibleList';
import { InspectorFieldProps } from './InspectorProperty';

export type ListPropertyProps = InspectorFieldProps & {
  titleExpanded?: ReactElement;
  values?: any;
  description?: string;
  expanded?: boolean;
  emptyText?: string;
};

const ListProperty = ({
  label,
  values,
  description,
  emptyText,
  ...props
}: InspectorFieldProps & ListPropertyProps) => {
  const [field] = useField(props);
  return (
    <CollapsibleList
      title={label}
      titleExpanded={props.titleExpanded}
      expanded={props.expanded}
    >
      {values?.length > 0 ? (
        <FieldArray
          {...field}
          name={props.name}
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
                    className="p-2 pr-0"
                  >
                    {values?.map((cmd: any, index: number) => (
                      <Draggable
                        key={index}
                        draggableId={`${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className="w-full mb-2 p-1 px-3 text-sm 
                      bg-white border border-circle-gray-300 rounded-md2 flex flex-row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <button
                              className="flex-1 cursor-pointer text-left text-circle-black leading-6"
                              type="button"
                            >
                              {cmd.name}
                            </button>
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
                          </div>
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
          {emptyText}
        </p>
      )}
    </CollapsibleList>
  );
};

export default ListProperty;
