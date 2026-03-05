import Block, { BlockProps } from "./Block";
import Grid from "../common/Grid";
import { useGetItems } from "../../network/item";
import EmptyCard from "../cards/EmptyCard";
import Heading from "../common/Heading";
import Text from "../common/Text";
import Button from "../common/Button";

function ItemsListBlock(props: BlockProps) {
  const items = useGetItems();

  return (
    <Block {...props}>
      <AddItemCard />
      <Grid items={items?.data || []} />
    </Block>
  );
}

function AddItemCard() {
  return (
    <EmptyCard>
      <div className="card-body">
        <Heading>No items found</Heading>
        <Text>Click the button below to add your first item.</Text>
        <div className="card-actions justify-end">
          <Button color="success" as="Link" to="/items/new">
            Add Item
          </Button>
        </div>
      </div>
    </EmptyCard>
  );
}

export default ItemsListBlock;
