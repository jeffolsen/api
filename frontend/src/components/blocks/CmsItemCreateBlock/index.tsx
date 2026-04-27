import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import { ItemCreateForm } from "@/components/forms/ItemCreateForm";
import EmptyCard from "@/components/cards/EmptyCard";
import { useNavigate } from "react-router";
import { TItem } from "@/network/item";
import useItemCreateBlockData, {
  UseItemCreateBlockData,
  UseItemCreateBlockProps,
} from "@/components/blocks/CmsItemCreateBlock/data";
import { paths } from "@/config/routes";

export default function Component(config: BlockComponentStandardProps) {
  const result = useItemCreateBlockData(config);
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
