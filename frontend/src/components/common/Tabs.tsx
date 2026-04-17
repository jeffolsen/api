import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx, { ClassValue } from "clsx";
import { Fragment, useEffect } from "react";
import { BlockUrlIdentifier } from "../blocks/Block";
import { useSearchParamWithDefault } from "../../hooks/useSearchParam";

export type TabPanelProps = {
  urlIdentifier: string;
};

export type TabsProps = {
  tabs: {
    name: string;
    Component: React.ComponentType<TabPanelProps>;
    getTabClasses?: (selected?: boolean, hover?: boolean) => ClassValue;
  }[];
  tabListClassName?: ClassValue;
} & BlockUrlIdentifier;

function Tabs({ tabs, tabListClassName, urlIdentifier, ...props }: TabsProps) {
  const componentSelectedQueryParam = `tabs${urlIdentifier}_selected`;
  const [selectedTab, setSelectedTab] = useSearchParamWithDefault(
    componentSelectedQueryParam,
    tabs[0]?.name || "",
  );
  useEffect(() => {
    return () => {
      setSelectedTab(undefined);
    };
  }, []);
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
                  !selected && "text-neutral-content/30",
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
              <Component
                key={name}
                urlIdentifier={componentSelectedQueryParam}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabList>
    </TabGroup>
  );
}

export default Tabs;
