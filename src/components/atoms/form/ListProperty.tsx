import { ArrayHelpers, FieldArray, useField } from 'formik';
import { ReactElement } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DeleteItemIcon from '../../../icons/ui/DeleteItemIcon';
import DragListIcon from '../../../icons/ui/DragItemIcon';
import { useStoreActions } from '../../../state/Hooks';
import CollapsibleList from '../../containers/CollapsibleList';
import AddButton from '../AddButton';
import { InspectorFieldProps } from './InspectorProperty';

export type ListItemChildProps = {
  item: any;
  index: number;
  values: any;
  setValue: (value: any) => void;
};

export type ListPropertyProps = InspectorFieldProps & {
  titleExpanded?: ReactElement;
  values?: any;
  description?: string;
  expanded?: boolean;
  empty?: string | ReactElement;
  addButton?: boolean;
  pinned?: ReactElement;
  listItem?: (props: ListItemChildProps) => ReactElement;
  labels?: (values: any) => string[];
};

export type ListItemProps = {
  index: number;
  parameters?: any;
  values?: any;
  arrayHelper: ArrayHelpers;
  children: ReactElement;
  lastRemaining: boolean;
  labels?: (values: any) => string[];
};

const ListItem = ({
  index,
  arrayHelper,
  children,
  values,
  lastRemaining,
  labels,
}: ListItemProps) => {
  const updateConfirmation = useStoreActions(
    (actions) => actions.triggerConfirmation,
  );

  return (
    <Draggable key={index} draggableId={`${index}`} index={index}>
      {(provided, _) => (
        <div
          className="w-full mb-4 p-1 px-3 text-sm 
bg-white border border-circle-gray-300 hover:border-circle-black rounded-md2 flex flex-row"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="ml-auto mr-3" {...provided.dragHandleProps}>
            <DragListIcon className="w-4 h-6 py-1" color="#AAAAAA" />
          </div>
          {children}
          {!lastRemaining && (
            <button
              onClick={() => {
                updateConfirmation({
                  modalDialogue: 'delete',
                  labels: labels ? labels(values) : ['item'],
                  onConfirm: () => arrayHelper.remove(index),
                });
              }}
              type="button"
              className="my-auto"
            >
              <DeleteItemIcon className="w-3 h-3" color="#AAAAAA" />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

// This is currently hard coded to support steps, but can be broken out to support other sorts of lists.

const ListProperty = ({
  label,
  values,
  description,
  empty: emptyText,
  children,
  listItem,
  labels,
  placeholder,
  fieldprops,
  ...props
}: ListPropertyProps) => {
  const [field] = useField(props) || fieldprops;
  const ListChild = listItem;

  return (
    <FieldArray
      {...field}
      name={props.name}
      render={(arrayHelper) => (
        <CollapsibleList
          title={label}
          className={props.className}
          titleExpanded={props.titleExpanded}
          expanded={props.expanded}
          pinned={
            (props.addButton && (
              <AddButton
                className="ml-auto"
                onClick={() => {
                  arrayHelper.push('');
                }}
              />
            )) ||
            props.pinned
          }
        >
          {field.value?.length > 0 ? (
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
              {children}
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-2 pr-0 flex flex-col"
                  >
                    {field.value.map((item: any, index: number) => {
                      return (
                        <ListItem
                          key={index}
                          lastRemaining={field.value.length === 1}
                          index={index}
                          values={item}
                          arrayHelper={arrayHelper}
                          labels={labels}
                        >
                          {ListChild ? (
                            <ListChild
                              setValue={(value) => {
                                arrayHelper.replace(index, value);
                              }}
                              item={item}
                              index={index}
                              values={values}
                            />
                          ) : (
                            <input
                              className="w-full h-full p-1"
                              defaultValue={item}
                              placeholder={placeholder}
                              onChange={(e) => {
                                arrayHelper.replace(index, e.target.value);
                              }}
                            />
                          )}
                        </ListItem>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <>
              <p className="ml-2 font-medium text-sm text-circle-gray-500">
                {emptyText}
              </p>
              {children}
            </>
          )}
        </CollapsibleList>
      )}
    />
  );
};

export default ListProperty;
