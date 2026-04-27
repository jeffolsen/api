import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import { FeedCreateForm } from "@/components/forms/FeedCreateForm";
import EmptyCard from "@/components/cards/EmptyCard";
import { useNavigate } from "react-router";
import { TFeed } from "@/network/feed";
import useFeedCreateBlockData, {
  UseFeedCreateBlockData,
  UseFeedCreateBlockProps,
} from "@/components/blocks/CmsFeedCreateBlock/data";
import { paths } from "@/config/routes";

export default function Component(config: BlockComponentStandardProps) {
  const result = useFeedCreateBlockData(config);
  if (result.type === "error") return null;
  const { blockProps, blockData } = result;
  return <CmsFeedCreateBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsFeedCreateBlock({
  blockProps,
}: {
  blockProps: UseFeedCreateBlockProps;
  blockData: UseFeedCreateBlockData;
}) {
  const navigate = useNavigate();

  return (
    <Block {...blockProps}>
      <EmptyCard>
        <div className="card-body">
          <FeedCreateForm
            handleSuccess={(args) => {
              navigate(
                paths.cmsFeedUpdate.replace(
                  ":id",
                  (args.feed as TFeed).id.toString(),
                ),
              );
            }}
          />
        </div>
      </EmptyCard>
    </Block>
  );
}
