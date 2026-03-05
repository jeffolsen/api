import Block, { BlockProps } from "./Block";
import { CreateItemForm } from "../forms/CreateItemForm";
import EmptyCard from "../cards/EmptyCard";

function CreateItemBlock(props: BlockProps) {
  return (
    <Block {...props}>
      <EmptyCard>
        <div className="card-body">
          <CreateItemForm />
        </div>
      </EmptyCard>
    </Block>
  );
}

export default CreateItemBlock;
