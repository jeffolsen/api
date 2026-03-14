import Block, { BlockProps } from "./Block";
import Grid from "../common/Grid";
import { useGetItems } from "../../network/item";
import EmptyCard from "../cards/EmptyCard";
import BasicCard from "../cards/BasicCard";
import Heading from "../common/Heading";
import Button from "../common/Button";
import { Link } from "react-router";

type Item = {
  id: number;
  name: string;
  description?: string;
};

function ItemsListBlock(props: BlockProps) {
  const items = useGetItems();
  const itemData: Item[] = items?.data || [];

  const itemCards = itemData.map((item) => (
    <Link key={item.id} to={`/items/${item.id}`} className="block h-full">
      <BasicCard title={item.name} description={item.description} />
    </Link>
  ));

  return (
    <Block {...props}>
      <AddItemCard />
      <Grid items={itemCards} />
    </Block>
  );
}

function AddItemCard() {
  const items = useGetItems();

  if (items.isLoading) {
    return (
      <EmptyCard>
        <div className="card-body card-compact">
          <Heading>Loading items...</Heading>
        </div>
      </EmptyCard>
    );
  }
  return (
    <EmptyCard>
      <div className="card-body card-compact">
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
