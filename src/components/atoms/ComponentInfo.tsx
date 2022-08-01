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

  return (
    <>
      <div className="font-medium text-sm text-circle-gray-400">
        {docInfo?.description}
      </div>
      <a
        className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
        href={docInfo?.link}
        target="circleci_docs"
      >
        Learn More
      </a>
    </>
  );
};

export default ComponentInfo;
