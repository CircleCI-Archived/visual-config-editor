import * as CircleCI from '@circleci/circleci-config-sdk';
import { Generable } from '@circleci/circleci-config-sdk/dist/src/lib/Components';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  OrbImport,
  OrbRef,
} from '@circleci/circleci-config-sdk/dist/src/lib/Orb';
import InspectableMapping from '../../mappings/InspectableMapping';
import { useStoreActions } from '../../state/Hooks';
import { InspectorDefinitionMenuNav } from '../menus/definitions/InspectorDefinitionMenu';

export const flattenGenerable = (data: Generable, nested?: boolean) => {
  // this generated object should always have a single key
  const generated = data.generate();

  if (typeof generated === 'string') {
    return { name: generated };
  }

  /**
   * Flattens the keys of the input.
   * Will nest under parameters if nested option is set
   */
  return Object.entries(generated as Record<string, any>).map(([key, value]) =>
    nested
      ? {
          name: key,
          parameters: value,
        }
      : {
          name: key,
          ...value,
        },
  )[0];
};

const Definition = (props: {
  data: Generable | OrbRef<AnyParameterLiteral>;
  type: InspectableMapping;
  index: number;
  orb?: OrbImport;
}) => {
  const Summary = props.type.components.summary;
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const setDragging = useStoreActions((actions) => actions.setDragging);

  return (
    <button
      className="w-full mb-2 p-2 text-sm cursor-pointer text-left text-circle-black 
      bg-white border border-circle-gray-300 rounded-md2 hover:border-gray-700"
      draggable="true"
      onDragStart={(e) => {
        const type = props.type;

        if (type?.dragTarget) {
          setDragging({ dataType: type, data: props.data });
        }
      }}
      onClick={(e) => {
        if (props.data instanceof CircleCI.orb.OrbRef) {
          return;
        }

        const flattened = flattenGenerable(props.data);

        navigateTo({
          component: InspectorDefinitionMenuNav,
          props: {
            data: props.data,
            editing: true,
            values: flattened,
            dataType: props.type,
            index: props.index,
          },
        });
      }}
    >
      <Summary data={props.data} />
    </button>
  );
};

export default Definition;
