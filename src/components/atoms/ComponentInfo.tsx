import ComponentMapping from '../../mappings/ComponentMapping';

const ComponentInfo = (props: { type: ComponentMapping }) => {
  return (
    <div className="pb-4">
      <p className="font-medium text-sm text-circle-gray-500">
        {props.type.docsInfo.description}
      </p>
      <a
        className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
        href={props.type.docsInfo.link}
        target="circleci_docs"
      >
        Learn More
      </a>
    </div>
  );
};

export default ComponentInfo;
