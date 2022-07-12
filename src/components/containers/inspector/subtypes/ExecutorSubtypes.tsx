import { executors } from '@circleci/circleci-config-sdk';
import { SubTypeMapping } from '../../../../mappings/GenerableMapping';
import InspectorProperty from '../../../atoms/form/InspectorProperty';

export interface ExecutorSubTypes {
  [type: string]: SubTypeMapping & {
    resourceClasses: string[];
  };
}

const executorSubtypes: ExecutorSubTypes = {
  docker: {
    text: 'Docker',
    component: executors.DockerExecutor,
    resourceClasses: [
      'small',
      'medium',
      'medium+',
      'large',
      'xlarge',
      '2xlarge',
      '2xlarge+',
    ],
    fields: <InspectorProperty label="Image" name="docker[0].image" required />,
    docsLink: 'https://circleci.com/docs/2.0/executor-types/#using-docker',
    description: 'Steps run in container with provided image',
  },
  machine: {
    text: 'Machine',
    component: executors.MachineExecutor,
    resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
    fields: <InspectorProperty label="Image" name="machine.image" required />,
    docsLink: 'https://circleci.com/docs/2.0/executor-types/#using-machine',
    description: 'Steps run on Linux Virtual Machine',
  },
  macos: {
    text: 'MacOS',
    component: executors.MacOSExecutor,
    resourceClasses: ['medium', 'large'],
    fields: <InspectorProperty label="Xcode" name="macos.xcode" required />,
    docsLink: 'https://circleci.com/docs/2.0/executor-types/#using-macos',
    description:
      'Steps run on macOS Virtual Machine with specific Xcode version',
  },
  windows: {
    text: 'Windows',
    component: executors.WindowsExecutor,
    resourceClasses: [
      'windows.medium',
      'windows.large',
      'windows.xlarge',
      'windows.2xlarge',
    ],
    fields: <InspectorProperty label="Image" name="machine.image" required />,
    docsLink:
      'https://circleci.com/docs/2.0/executor-types/#using-the-windows-executor',
    description: 'Steps run on Windows Virtual Machine',
  },
};

export { executorSubtypes };
