import Block, { BlockComponentStandardProps } from "../Block";
import { FeedCreateForm } from "../../forms/FeedCreateForm";
import EmptyCard from "../../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TFeed } from "../../../network/feed";
import useFeedCreateBlockData, {
  UseFeedCreateBlockData,
  UseFeedCreateBlockProps,
} from "./data";
import { paths } from "../../../config/routes";

export default function Component({
  component,
  params,
  path,
}: BlockComponentStandardProps) {
  const result = useFeedCreateBlockData({ component, params, path });
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
