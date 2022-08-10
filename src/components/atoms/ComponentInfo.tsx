import InspectableMapping, {
  GenerableInfoType,
} from '../../mappings/InspectableMapping';

const ComponentInfo = ({
  type,
  docsInfo,
}: {
  type?: InspectableMapping;
  docsInfo?: GenerableInfoType;
}) => {
  const docInfo = type?.docsInfo || docsInfo;
  const parts = docInfo?.description.split('%s');

  return (
    <>
      {parts && (
        <p className="font-normal text-sm text-circle-black">
          {parts[0]}
          <a
            className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
            href={docInfo?.link}
            target="circleci_docs"
          >
            {type?.name.singular}
          </a>
          {parts[1]}
        </p>
      )}
    </>
  );
};

export default ComponentInfo;
