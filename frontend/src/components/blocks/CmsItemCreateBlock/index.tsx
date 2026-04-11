import Block, { BlockStandardProps } from "../Block";
import { ItemCreateForm } from "../../forms/ItemCreateForm";
import EmptyCard from "../../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TItem } from "../../../network/item";
import useItemCreateBlockData, {
  UseItemCreateBlockDataReturnType,
} from "./data";
import { paths } from "../../../config/routes";

export default function Component({
  component,
  params,
  path,
}: BlockStandardProps) {
  const result = useItemCreateBlockData({ component, params, path });
  const { blockProps, blockData, error } = result;

  if (error && !blockProps && !blockData) {
    return null;
  }

  return <CmsItemCreateBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsItemCreateBlock({
  blockProps,
}: {
  blockProps: UseItemCreateBlockDataReturnType["blockProps"];
  blockData: UseItemCreateBlockDataReturnType["blockData"];
}) {
  const navigate = useNavigate();

  return (
    <Block {...blockProps}>
      <EmptyCard>
        <div className="card-body">
          <ItemCreateForm
            handleSuccess={(args) => {
              navigate(
                paths.cmsItemUpdate.replace(
                  ":id",
                  (args.item as TItem).id.toString(),
                ),
              );
            }}
          />
        </div>
      </EmptyCard>
    </Block>
  );
}
