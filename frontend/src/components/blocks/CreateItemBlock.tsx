import Block, { BlockProps } from "./Block";
import { ItemCreateForm } from "../forms/ItemCreateForm";
import EmptyCard from "../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TItem } from "../../network/item";

function CreateItemBlock(props: BlockProps) {
  const navigate = useNavigate();
  return (
    <Block {...props}>
      <EmptyCard>
        <div className="card-body">
          <ItemCreateForm
            handleSuccess={(args) => {
              navigate(`/items/${(args.item as TItem).id}`);
            }}
          />
        </div>
      </EmptyCard>
    </Block>
  );
}

export default CreateItemBlock;
