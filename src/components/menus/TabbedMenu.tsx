import { useEffect, useState } from 'react';

export interface TabbedPaneProps {
  tabs: string[];
  activeTab?: number;
  /**
   * Tracks to see if this component needs to be refreshed
   * Useful if the tab needs to be updated but this component
   * is already mounted
   */
  id?: string;
  children: React.ReactNode | React.ReactNode[];
  onChange?: (index: number) => void;
}

const TabbedMenu = (props: TabbedPaneProps) => {
  const tabKey = props.id || 'default';
  const [id, setId] = useState(props.id);
  const [activeTab, setActiveTab] = useState({
    [tabKey]: props.activeTab || 0,
  });

  useEffect(() => {
    if (id !== tabKey) {
      setId(tabKey);

      if (activeTab[tabKey] === undefined) {
        setActiveTab({ ...activeTab, [tabKey]: props.activeTab || 0 });
      }
    }
  }, [tabKey, id, activeTab, setActiveTab, setId, props.activeTab]);

  return (
    <div className="h-full">
      <div className="flex border-b border-circle-gray-300 pl-6">
        {props.tabs.map((tab, index) => (
          <button
            type="button"
            key={index}
            className={`text-sm tracking-wide px-3 py-3 font-bold text-center ${
              index === activeTab[tabKey]
                ? 'border-black border-b-4 text-circle-black'
                : 'text-circle-gray-600 mb-1'
            }`}
            onClick={() => {
              if (props.onChange) {
                props.onChange(index);
              }

              setActiveTab({ ...activeTab, [tabKey]: index });
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {Array.isArray(props.children)
        ? props.children[activeTab[tabKey]]
        : props.children}
    </div>
  );
};

export default TabbedMenu;
