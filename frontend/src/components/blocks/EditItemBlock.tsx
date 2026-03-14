import Block, { BlockProps } from "./Block";
import EmptyCard from "../cards/EmptyCard";

function EditItemBlock(props: BlockProps) {
  const id = props.params?.id;
  return (
    <Block {...props}>
      <EmptyCard>
        <div className="card-body">
          {/* TODO: build EditItemForm, using id={id} */}
          <p>Edit item {id}</p>
        </div>
      </EmptyCard>
    </Block>
  );
}

export default EditItemBlock;
