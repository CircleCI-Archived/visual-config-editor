import { ExternalLinks } from "./ExternalLinks";
import PreviewToolbox from "./PreviewToolbox";

export default function HeaderMenu() {
  return (
    <div className="absolute z-50 flex flex-row p-4 space-x-2">
      <PreviewToolbox />
      <ExternalLinks />
    </div>
  );
}