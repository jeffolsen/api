import Block, { BlockComponentStandardProps } from "../Block";
import EmptyCard from "../../cards/EmptyCard";
import Loading from "../../common/Loading";
import {
  ItemDeleteButton,
  ItemRepublishForm,
  ItemUpdateForm,
} from "../../forms/ItemCreateForm";
import { convertZuluToLocalDateTime } from "../../../utils/time";
import Text from "../../common/Text";
import dayjs, { techDatetime } from "../../../utils/dayjs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Heading from "../../common/Heading";
import { ScheduleStatus } from "../../inputs/FormSubmitAndPublish";
import useItemUpdateBlockData, {
  UseItemUpdateBlockData,
  UseItemUpdateBlockProps,
} from "./data";
import { paths } from "../../../config/routes";

export default function Component(config: BlockComponentStandardProps) {
  const result = useItemUpdateBlockData(config);
  if (result.type === "error") return null;
  const { blockProps, blockData } = result;
  return <CmsItemUpdateBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsItemUpdateBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseItemUpdateBlockProps;
  blockData: UseItemUpdateBlockData;
}) {
  const navigate = useNavigate();

  const {
    itemData: getItem,
    tagsData: getTags,
    imagesData: getImages,
    dateRangesData: getDateRanges,
  } = blockData;

  if (
    getItem.isLoading ||
    getTags.isLoading ||
    getImages.isLoading ||
    getDateRanges.isLoading
  ) {
    return <Loading />;
  }

  const item = getItem.data.item;
  const tags = getTags.data.tags;
  const images = getImages.data.images;
  const dateRanges = getDateRanges.data.dateRanges;
  const itemWithResources = {
    ...getItem.data.item,
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
    <Block {...blockProps}>
      <EmptyCard>
        <div className="card-body md:flex-row gap-4 justify-between w-full text-neutral-content/80">
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
                defaultValues={{ id: item.id, publishedAt, expiredAt }}
              />
              <ItemDeleteButton
                defaultValues={{ id: item.id }}
                handleSuccess={() => {
                  toast.success("Item deleted successfully");
                  navigate(paths.cmsItemsList);
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
