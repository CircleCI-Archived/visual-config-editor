import { executor } from '@circleci/circleci-config-sdk';
import { DockerExecutor, MachineExecutor, MacOSExecutor, WindowsExecutor } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Executor';
import { SubTypeMapping } from '../../../../mappings/ComponentMapping';
import InspectorProperty from '../../../atoms/form/InspectorProperty';

export interface ExecutorSubTypes {
  [type: string]: SubTypeMapping & {
    resourceClasses: string[];
  };  
}

const executorSubtypes: ExecutorSubTypes = {
  docker: {
    text: 'Docker',
    component: executor.DockerExecutor,
    resourceClasses: [
      'small',
      'medium',
      'medium+',
      'large',
      'xlarge',
      '2xlarge',
      '2xlarge+',
    ],
    fields: (
      <InspectorProperty label="Image" name="executor.image.image" required />
    ),
    docsLink: 'https://circleci.com/docs/2.0/executor-types/#using-docker',
    description: 'Steps run in container with provided image',
  },
  machine: {
    text: 'Machine',
    component: executor.MachineExecutor,
    resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
    fields: <InspectorProperty label="Image" name="executor.image" required />,
    docsLink: 'https://circleci.com/docs/2.0/executor-types/#using-machine',
    description: 'Steps run on Linux Virtual Machine',
  },
  macos: {
    text: 'MacOS',
    component: executor.MacOSExecutor,
    resourceClasses: ['medium', 'large'],
    fields: <InspectorProperty label="Xcode" name="executor.xcode" required />,
    docsLink: 'https://circleci.com/docs/2.0/executor-types/#using-macos',
    description:
      'Steps run on macOS Virtual Machine with specific Xcode version',
  },
  windows: {
    text: 'Windows',
    component: executor.WindowsExecutor,
    resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
    fields: <InspectorProperty label="Image" name="executor.image" required />,
    docsLink: 'https://circleci.com/docs/2.0/executor-types/#using-the-windows-executor',
    description: 'Steps run on Windows Virtual Machine',
  },
};

export { executorSubtypes };
