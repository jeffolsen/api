import Button from "../common/Button";
import Heading, { HeadingLevelProvider } from "../common/Heading";
import List from "../common/List";
import Text from "../common/Text";
import Block, { BlockProps } from "./Block";
import { useModalContext } from "../../contexts/ModalContext";
import DialogModal, { DialogModalProps } from "../modals/DialogModal";
// import ImageSelector from "../inputs/ImageSelectInput";

import { CreateItemForm } from "../forms/CreateItemForm";

function StyleGuideBlock(props: BlockProps) {
  const { enqueueModals } = useModalContext();

  return (
    <Block {...props}>
      <CreateItemForm heading="Create Item" submitButtonText="Create Item" />
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
        <Button
          onClick={() =>
            enqueueModals([
              {
                component: DialogModal,
                props: {
                  title: "Registration Successful!",
                  content: "You have been successfully registered.",
                } as DialogModalProps,
              },
            ])
          }
        >
          Default Button
        </Button>
        <Button color="primary">Primary Button</Button>
        <Button color="secondary">Secondary Button</Button>
        <Button color="accent">Accent Button</Button>
        <Button color="error">Error Button</Button>
      </HeadingLevelProvider>
    </Block>
  );
}

export default StyleGuideBlock;
