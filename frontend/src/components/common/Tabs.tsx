import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export type TabsProps = {
  tabs: { name: string; Component: React.ComponentType }[];
};

function Tabs({ tabs }: TabsProps) {
  return (
    <TabGroup className="w-full flex flex-col gap-4">
      <TabList className="tabs">
        {tabs.map(({ name }) => (
          <Tab
            as="a"
            key={name}
            className="focus-visible:outline-none tab tab-bordered tab-lg tab-active"
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map(({ name, Component }) => (
          <TabPanel key={name} className="flex flex-col gap-4">
            <Component />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

export default Tabs;
