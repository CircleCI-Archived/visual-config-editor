import MoreIcon from '../../icons/ui/MoreIcon';
import DropdownContainer from './DropdownContainer';

export const ExternalLinks = () => {
  const links = [
    {
      name: 'Report an Issue',
      url: 'https://github.com/CircleCI-Public/visual-config-editor/issues/new/choose',
    },
    {
      name: 'Contribute',
      url: 'https://github.com/CircleCI-Public/visual-config-editor',
    },
  ];
  return (
    <DropdownContainer alignLeft>
      <div className="flex rounded-md px-4 h-10 items-center justify-center border bg-circle-gray-250 hover:bg-circle-gray-300">
        <MoreIcon className="w-5 my-auto flex" />
      </div>
      <div className="rounded border border-circle-gray-300 p-2 z-30 bg-white flex flex-col">
        {links.map((link) => (
          <a
            href={link.url}
            key={link.name}
            className="rounded flex w-full hover:bg-circle-gray-250 border-b border-circle-gray-300 p-2"
          >
            {link.name}
          </a>
        ))}
      </div>
    </DropdownContainer>
  );
};
