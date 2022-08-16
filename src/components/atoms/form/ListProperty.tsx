import {
  ArrayHelpers,
  FieldArray,
  FieldArrayRenderProps,
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  useField,
} from 'formik';
import { ReactElement } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DeleteItemIcon from '../../../icons/ui/DeleteItemIcon';
import DragListIcon from '../../../icons/ui/DragItemIcon';
import { useStoreActions } from '../../../state/Hooks';
import CollapsibleList from '../../containers/CollapsibleList';
import AddButton from '../AddButton';
import { Info } from '../Info';
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
  titleFont?: string;
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
          className={`w-full mb-2 p-1 px-3
border border-circle-gray-300 hover:border-circle-black shadow-sm rounded flex flex-row ${
            children ? 'bg-white' : 'bg-circle-gray-300'
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="ml-auto mr-3 my-auto" {...provided.dragHandleProps}>
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

const ListProperty = (props: ListPropertyProps) => {
  const field = useField(props);

  return (
    <FieldArray
      {...field}
      name={props.name}
      render={(arrayHelper) => (
        <FieldlessListProperty
          {...props}
          field={field}
          arrayHelper={arrayHelper}
        />
      )}
    />
  );
};

export const FieldlessListProperty = ({
  label,
  values,
  description,
  empty,
  children,
  listItem,
  labels,
  field,
  placeholder,
  arrayHelper,
  ...props
}: ListPropertyProps & {
  field: [FieldInputProps<any>, FieldMetaProps<any>, FieldHelperProps<any>];
  arrayHelper: FieldArrayRenderProps;
}) => {
  const [input, , helper] = field;
  const ListChild = listItem;

  return (
    <CollapsibleList
      title={
        <div className="flex flex-row">
          {label}
          {description && <Info description={description} />}
        </div>
      }
      titleFont={props.titleFont}
      className={props.className}
      titleExpanded={props.titleExpanded}
      expanded={props.expanded}
      pinned={
        <>
          {props.addButton && (
            <AddButton
              className="ml-auto"
              onClick={() => {
                helper.setValue(input.value ? [...input.value, ''] : ['']);
              }}
            />
          )}
          {props.pinned}
        </>
      }
    >
      {input.value?.length > 0 ? (
        <DragDropContext
          onDragEnd={(result) => {
            if (result.destination) {
              arrayHelper.move(result.source.index, result.destination.index);
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
                {input.value.map((item: any, index: number) => {
                  return (
                    <ListItem
                      key={index}
                      lastRemaining={input.value.length === 1}
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
          <div className="ml-2 font-medium text-sm text-circle-gray-500">
            {empty}
          </div>
          {children}
        </>
      )}
    </CollapsibleList>
  );
};

export default ListProperty;
