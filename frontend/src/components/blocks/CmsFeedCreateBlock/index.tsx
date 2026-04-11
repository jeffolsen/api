import Block, { BlockStandardProps } from "../Block";
import { FeedCreateForm } from "../../forms/FeedCreateForm";
import EmptyCard from "../../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TFeed } from "../../../network/feed";
import useFeedCreateBlockData, {
  UseFeedCreateBlockDataReturnType,
} from "./data";
import { paths } from "../../../config/routes";

export default function Component({
  component,
  params,
  path,
}: BlockStandardProps) {
  const result = useFeedCreateBlockData({ component, params, path });
  const { blockProps, blockData, error } = result;

  if (error && !blockProps && !blockData) {
    return null;
  }

  return <CmsFeedCreateBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsFeedCreateBlock({
  blockProps,
}: {
  blockProps: UseFeedCreateBlockDataReturnType["blockProps"];
  blockData: UseFeedCreateBlockDataReturnType["blockData"];
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
