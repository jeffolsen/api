import Block, { BlockProps } from "./Block";
import { FeedCreateForm } from "../forms/FeedCreateForm";
import EmptyCard from "../cards/EmptyCard";
import { useNavigate } from "react-router";
import { TFeed } from "../../network/feed";

function FeedCreateBlock(props: BlockProps) {
  const navigate = useNavigate();
  return (
    <Block {...props}>
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

export default FeedCreateBlock;
