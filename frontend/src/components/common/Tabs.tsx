import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx, { ClassValue } from "clsx";
import { Fragment } from "react";

export type TabsProps = {
  tabs: {
    name: string;
    Component: React.ComponentType;
    getTabClasses?: (selected?: boolean, hover?: boolean) => ClassValue;
  }[];
};

function Tabs({
  tabs,
  tabListClassName,
  ...props
}: TabsProps & { tabListClassName?: ClassValue }) {
  return (
    <TabGroup className="w-full flex flex-col gap-4" {...props}>
      <TabList className={clsx([tabListClassName])}>
        {tabs.map(({ name, getTabClasses }) => (
          <Tab as={Fragment} key={name}>
            {({ selected, hover }) => (
              <button
                className={clsx([
                  "focus-visible:outline-none flex-1",
                  selected && "tab-active",
                  hover && "underline",
                  !selected && "text-primary-content/30",
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
