import MoreIcon from '../../icons/ui/MoreIcon';
import DropdownContainer from '../containers/DropdownContainer';

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
    <DropdownContainer
      alignLeft
      className="flex flex-1 rounded-md w-10 bg-white items-center justify-center px-2 border border-circle-gray-300 hover:bg-circle-gray-250"
    >
      <MoreIcon className="w-5 h-6" />
      <div className="rounded border border-circle-gray-300 p-2 z-30 bg-white flex flex-col">
        {links.map((link) => (
          <a
            href={link.url}
            className="rounded flex w-full hover:bg-circle-gray-250 border-b border-circle-gray-300 p-2"
          >
            {link.name}
          </a>
        ))}
      </div>
    </DropdownContainer>
  );
};
