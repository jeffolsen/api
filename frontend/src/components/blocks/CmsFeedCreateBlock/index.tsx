import Block from "../Block";
import { FeedCreateForm } from "../../forms/FeedCreateForm";
import EmptyCard from "../../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TFeed } from "../../../network/feed";
import useFeedCreateBlockData from "./data";

function CmsFeedCreateBlock() {
  const result = useFeedCreateBlockData();
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
          <FeedCreateForm
            handleSuccess={(args) => {
              navigate(`/feeds/${(args.feed as TFeed).id}`);
            }}
          />
        </div>
      </EmptyCard>
    </Block>
  );
}

export default CmsFeedCreateBlock;
