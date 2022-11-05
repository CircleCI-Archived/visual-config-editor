import { Button } from '../atoms/Button';
import { ExternalLinks } from './ExternalLinks';
import { FlowTools } from './FlowTools';
import PreviewToolbox from './PreviewToolbox';

export default function HeaderMenu() {
  return (
    <div className="ml-auto flex my-auto flex-row space-x-2">
      <FlowTools />
      <ExternalLinks />
    </div>
  );
}
