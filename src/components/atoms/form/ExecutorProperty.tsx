import { orb, reusable } from '@circleci/circleci-config-sdk';
import {
  DefinitionRecord,
  mapDefinitions,
} from '../../../state/DefinitionStore';
import CollapsibleList from '../../containers/CollapsibleList';
import ParamListContainer from '../../containers/ParamListContainer';
import { OrbImportWithMeta } from '../../menus/definitions/OrbDefinitionsMenu';
import InspectorProperty, { InspectorFieldProps } from './InspectorProperty';

export type ExecutorPool = DefinitionRecord<
  reusable.ReusableExecutor | OrbImportWithMeta
>;

export type ExecutorPropertyProps = {
  orbPool: DefinitionRecord<OrbImportWithMeta>;
  definitionPool: DefinitionRecord<reusable.ReusableExecutor>;
  name: string;
  label?: string;
};

export const ExecutorProperty = ({
  orbPool,
  definitionPool,
  label,
  name,
  ...props
}: ExecutorPropertyProps & InspectorFieldProps) => {
  return (
    <InspectorProperty
      label={label || "Executor"}
      as="select"
      name={`${name}.name`}
      className="w-full"  
      {...props}
      dependent={(executorName: string) => {
        const splitName = executorName?.split('/');

        if (!splitName) {
          return <></>;
        }
        const executor =
          splitName.length === 1
            ? definitionPool[executorName]?.value
            : orbPool[splitName[0]].value?.executors[splitName[1]];

        return (
          <>
            {executor?.parameters && (
              <>
                <CollapsibleList title="Properties" expanded>
                  <div className="pt-2">
                    <ParamListContainer
                      paramList={executor.parameters}
                      parent="executor"
                    />
                  </div>
                </CollapsibleList>
                <div className="w-full border-b border-circle-gray-300 my-2"></div>
              </>
            )}
          </>
        );
      }}
    >
      {[
        ...mapDefinitions(definitionPool, (executor) => (
          <option value={executor.name} key={executor.name}>
            {executor.name}
          </option>
        )),
        ...mapDefinitions<orb.OrbImport>(
          orbPool,
          (orb) =>
            orb.executors &&
            Object.values(orb.executors).map((executor) => (
              <option value={executor.name} key={executor.name}>
                {executor.name}
              </option>
            )),
        ),
      ]}
    </InspectorProperty>
  );
};
