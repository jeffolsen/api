import Block, { BlockProps } from "./Block";
import { CreateItemForm } from "../forms/CreateItemForm";
import EmptyCard from "../cards/EmptyCard";
import { useNavigate } from "react-router";

function CreateItemBlock(props: BlockProps) {
  const navigate = useNavigate();
  return (
    <Block {...props}>
      <EmptyCard>
        <div className="card-body">
          <CreateItemForm
            handleSuccess={(args) => {
              navigate(`/items/${args.id}`);
            }}
          />
        </div>
      </EmptyCard>
    </Block>
  );
}

export default CreateItemBlock;
