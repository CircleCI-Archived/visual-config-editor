import { useState } from 'react';

export interface TabbedPaneProps {
  tabs: string[];
  children: React.ReactNode | React.ReactNode[];
}

const TabbedMenu = (props: TabbedPaneProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="h-full">
      <div className="flex border-b border-circle-gray-300 pl-6">
        {props.tabs.map((tab, index) => (
          <button
            key={index}
            className={`text-sm tracking-wide px-3 py-3 font-bold text-center ${
              index === activeTab
                ? 'border-black border-b-4 text-circle-black'
                : 'text-circle-gray-600 mb-1'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      {Array.isArray(props.children) ?  props.children[activeTab] : props.children}
    </div>
  );
};

export default TabbedMenu;
