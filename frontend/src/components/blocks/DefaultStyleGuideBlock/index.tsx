import Button from "@/components/common/Button";
import Heading, { HeadingLevelProvider } from "@/components/common/Heading";
import List from "@/components/common/List";
import Text from "@/components/common/Text";
import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import Modal from "@/components/layout/Modal";
import { useState } from "react";
import useStyleGuideBlockData from "@/components/blocks/DefaultStyleGuideBlock/data";

function StyleGuideBlock(config: BlockComponentStandardProps) {
  const result = useStyleGuideBlockData(config);
  const [openModal, setOpenModal] = useState(false);

  if (result.type === "error") return null;

  const {
    blockProps: { name, settings },
  } = result;

  return (
    <Block name={name} settings={settings}>
      <HeadingLevelProvider>
        <Heading headingSize="xxl" headingStyles="uppercase">
          Heading xxl
        </Heading>
        <Heading headingSize="xl" headingStyles="uppercase">
          Heading xl
        </Heading>
        <Heading headingSize="lg" headingStyles="uppercase">
          Heading lg
        </Heading>
        <Heading headingSize="md" headingStyles="uppercase">
          Heading md
        </Heading>
        <Heading headingSize="sm" headingStyles="uppercase">
          Heading sm
        </Heading>
        <Heading headingSize="xs" headingStyles="uppercase">
          Heading xs
        </Heading>
        <hr />
        <Text textSize="xxl">Content for Heading xxl</Text>
        <Text textSize="xl">Content for Heading xl</Text>
        <Text textSize="lg">Content for Heading lg</Text>
        <Text textSize="md">Content for Heading md</Text>
        <Text textSize="sm">Content for Heading sm</Text>
        <Text textSize="xs">Content for Heading xs</Text>
        <hr />
        <List
          textSize="lg"
          listDecorator={false}
          items={["undecorated List item 1", "undecorated List item 2"]}
        />
        <List
          textSize="lg"
          items={["unordered List item 1", "unordered List item 2"]}
        />
        <List
          textSize="lg"
          as="ol"
          items={["ordered List item 1", "ordered List item 2"]}
        />
        <List
          textSize="md"
          listDecorator={false}
          items={["undecorated List item 1", "undecorated List item 2"]}
        />
        <List
          textSize="md"
          items={["unordered List item 1", "unordered List item 2"]}
        />
        <List
          textSize="md"
          as="ol"
          items={["ordered List item 1", "ordered List item 2"]}
        />
        <List
          textSize="sm"
          listDecorator={false}
          items={["undecorated List item 1", "undecorated List item 2"]}
        />
        <List
          textSize="sm"
          items={["unordered List item 1", "unordered List item 2"]}
        />
        <List
          textSize="sm"
          as="ol"
          items={["ordered List item 1", "ordered List item 2"]}
        />
        <List
          textSize="xs"
          listDecorator={false}
          items={["undecorated List item 1", "undecorated List item 2"]}
        />
        <List
          textSize="xs"
          items={["unordered List item 1", "unordered List item 2"]}
        />
        <List
          textSize="xs"
          as="ol"
          items={["ordered List item 1", "ordered List item 2"]}
        />
        <hr />
        <Button onClick={() => setOpenModal(true)}>Default Button</Button>
        <Button color="primary">Primary Button</Button>
        <Button color="secondary">Secondary Button</Button>
        <Button color="accent">Accent Button</Button>
        <Button color="error">Error Button</Button>
      </HeadingLevelProvider>
      <Modal
        onClose={() => setOpenModal(false)}
        isOpen={openModal}
        setIsOpen={setOpenModal}
      >
        <div className="flex flex-col gap-4">
          <Heading headingSize="lg">Modal Title</Heading>
          <Text>This is the content of the Modal.</Text>
          <Button onClick={() => setOpenModal(false)}>Close Modal</Button>
        </div>
      </Modal>
    </Block>
  );
}

export default StyleGuideBlock;
