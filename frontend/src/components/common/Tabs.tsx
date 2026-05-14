import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx, { ClassValue } from "clsx";
import { Fragment, useState } from "react";

export type TabsProps = {
  tabs: {
    name: string;
    Component: React.ComponentType;
    getTabClasses?: (selected?: boolean, hover?: boolean) => ClassValue;
  }[];
  tabListClassName?: ClassValue;
};
function Tabs({ tabs, tabListClassName, ...props }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]?.name || "");
  return (
    <TabGroup
      selectedIndex={tabs.findIndex((tab) => tab.name === selectedTab)}
      onChange={(index) => setSelectedTab(tabs[index].name)}
      className="w-full flex flex-col gap-4"
      {...props}
    >
      <TabList className={clsx([tabListClassName])}>
        {tabs.map(({ name, getTabClasses }) => (
          <Tab as={Fragment} key={name}>
            {({ selected, hover }) => (
              <button
                className={clsx([
                  "focus-visible:outline-none flex-1",
                  selected && "tab-active",
                  hover && "underline",
                  !selected && "text-base/30",
                  getTabClasses?.(selected, hover),
                ])}
              >
                {name}
              </button>
            )}
          </Tab>
        ))}
        <TabPanels className="w-full">
          {tabs.map(({ name, Component }) => (
            <TabPanel key={name} className="flex flex-col gap-4">
              <Component key={name} />
            </TabPanel>
          ))}
        </TabPanels>
      </TabList>
    </TabGroup>
  );
}

export default Tabs;
