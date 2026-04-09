import Block from "../Block";
import { ItemCreateForm } from "../../forms/ItemCreateForm";
import EmptyCard from "../../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TItem } from "../../../network/item";
import useItemCreateBlockData from "./data";

function CmsItemCreateBlock() {
  const result = useItemCreateBlockData();
  const navigate = useNavigate();

  if ("error" in result) {
    navigate("/401", { replace: true });
    return null;
  }
  const { blockProps } = result;

  return (
    <Block {...blockProps}>
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

export default CmsItemCreateBlock;
