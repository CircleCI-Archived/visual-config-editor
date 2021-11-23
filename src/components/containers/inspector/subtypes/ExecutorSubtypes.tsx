import { ReactElement } from 'react';
import InspectorProperty from '../../../atoms/form/InspectorProperty';

export interface ExecutorSubTypes {
  [type: string]: {
    name: string;
    fields: ReactElement;
    resourceClasses: string[];
  };
}

const executorSubtypes: ExecutorSubTypes = {
  docker: {
    name: 'Docker',
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
  },
  machine: {
    name: 'Machine',
    resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
    fields: <InspectorProperty label="Image" name="executor.image" required />,
  },
  macos: {
    name: 'MacOS',
    resourceClasses: ['medium', 'large'],
    fields: <InspectorProperty label="XCode" name="executor.xcode" required />,
  },
  windows: {
    name: 'Windows',
    resourceClasses: ['medium', 'large', 'xlarge', '2xlarge'],
    fields: <InspectorProperty label="Image" name="executor.image" required />,
  },
};

export { executorSubtypes };
