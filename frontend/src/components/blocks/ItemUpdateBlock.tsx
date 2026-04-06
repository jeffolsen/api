import Block, { BlockProps } from "./Block";
import EmptyCard from "../cards/EmptyCard";
import {
  useGetItemById,
  useGetItemDateRanges,
  useGetItemImages,
  useGetItemsTags,
} from "../../network/item";
import Loading from "../common/Loading";
import {
  ItemDeleteButton,
  ItemRepublishForm,
  ItemUpdateForm,
} from "../forms/ItemCreateForm";
import { convertZuluToLocalDateTime } from "../../utils/time";
import Text from "../common/Text";
import dayjs, { techDatetime } from "../../utils/dayjs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Heading from "../common/Heading";
import { ScheduleStatus } from "../inputs/FormPublishSubmit";

function ItemUpdateBlock(props: BlockProps) {
  const navigate = useNavigate();
  const id = parseInt(props.params?.id || "");
  const getItem = useGetItemById(id);
  const getTags = useGetItemsTags(id);
  const getImages = useGetItemImages(id);
  const getDateRanges = useGetItemDateRanges(id);

  if (getItem.error) {
    navigate("/404", { replace: true });
  }

  const item = getItem.data?.item;
  const tags = getTags.data?.tags || [];
  const images = getImages.data?.images || [];
  const dateRanges = getDateRanges.data?.dateRanges || [];

  if (
    getItem.isLoading ||
    getTags.isLoading ||
    getImages.isLoading ||
    getDateRanges.isLoading
  ) {
    return <Loading />;
  }

  const itemWithResources = {
    ...item,
    tags,
    images,
    dateRanges,
  };

  const publishedAt = item.publishedAt
    ? convertZuluToLocalDateTime(item.publishedAt)
    : null;
  const expiredAt = item.expiredAt
    ? convertZuluToLocalDateTime(item.expiredAt)
    : null;

  return (
    <Block {...props}>
      <EmptyCard>
        <div className="card-body md:flex-row gap-4 justify-between w-full text-neutral-content/70">
          <div className="flex flex-col flex-grow justify-between gap-3">
            <Heading
              headingSize="xs"
              headingStyles="uppercase flex-none line-clamp-2"
            >
              {item.sortName}
            </Heading>
            <Text textSize="xs" className="italic flex-none">
              Last updated:{" "}
              {dayjs(convertZuluToLocalDateTime(item.updatedAt)).format(
                techDatetime,
              )}
            </Text>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Text textSize="xs">
              <ScheduleStatus publishedAt={publishedAt} expiredAt={expiredAt} />
            </Text>
            <div className="flex gap-1">
              <ItemRepublishForm
                formStyles="inline-flex"
                defaultValues={{ id, publishedAt, expiredAt }}
              />
              <ItemDeleteButton
                defaultValues={{ id }}
                handleSuccess={() => {
                  toast.success("Item deleted successfully");
                  navigate("/items");
                }}
              />
            </div>
          </div>
        </div>
      </EmptyCard>
      <EmptyCard>
        <div className="card-body">
          <ItemUpdateForm
            defaultValues={itemWithResources}
            handleSuccess={() => toast.success("Item updated successfully")}
          />
        </div>
      </EmptyCard>
    </Block>
  );
}

export default ItemUpdateBlock;
