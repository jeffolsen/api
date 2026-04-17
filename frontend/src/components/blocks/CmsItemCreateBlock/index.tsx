import Block, { BlockComponentStandardProps } from "../Block";
import { ItemCreateForm } from "../../forms/ItemCreateForm";
import EmptyCard from "../../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TItem } from "../../../network/item";
import useItemCreateBlockData, {
  UseItemCreateBlockData,
  UseItemCreateBlockProps,
} from "./data";
import { paths } from "../../../config/routes";

export default function Component({
  component,
  params,
  path,
}: BlockComponentStandardProps) {
  const result = useItemCreateBlockData({ component, params, path });
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }
  const { blockProps, blockData } = result;
  return <CmsItemCreateBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsItemCreateBlock({
  blockProps,
}: {
  blockProps: UseItemCreateBlockProps;
  blockData: UseItemCreateBlockData;
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
