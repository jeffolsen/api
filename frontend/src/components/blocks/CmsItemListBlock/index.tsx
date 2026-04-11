import Block, { BlockStandardProps } from "../Block";
import Grid from "../../common/Grid";
import {
  TItem,
  useGetItemsTags,
  GetItemsResponse,
} from "../../../network/item";
import EmptyCard from "../../cards/EmptyCard";
import Heading, { HeadingLevelProvider } from "../../common/Heading";
import Text from "../../common/Text";
import { convertZuluToLocalDateTime } from "../../../utils/time";
import dayjs, { techDatetime } from "../../../utils/dayjs";
import {
  ItemDeleteButton,
  ItemRepublishForm,
} from "../../forms/ItemCreateForm";
import { toast } from "react-hot-toast/headless";
import Button from "../../common/Button";
import Loading from "../../common/Loading";
import DashBoardLayout from "../../layout/DashBoardLayout";
import SectionHeading from "../../partials/SectionHeading";
import { ScheduleStatus } from "../../inputs/FormPublishSubmit";
import DropDownMenu from "../../common/DropDownMenu";
import {
  useSearchParamWithDefault,
  useSearchParam,
} from "../../../hooks/useSearchParam";
import { TTag, useGetTags } from "../../../network/tag";
import { useMemo } from "react";
import { ListNavigation, ListSortControl } from "../../partials/ListNavigation";
import BasicCard from "../../cards/BasicCard";
import useItemListBlockData, { UseItemListSuccessReturnType } from "./data";
import { paths } from "../../../config/routes";

export default function Component({
  component,
  params,
  path,
}: BlockStandardProps) {
  const result = useItemListBlockData({ component, params, path });
  const { blockProps, blockData, error } = result;

  if (error && !blockProps && !blockData) {
    return null;
  }

  return <CmsItemsListBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsItemsListBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseItemListSuccessReturnType["blockProps"];
  blockData: UseItemListSuccessReturnType["blockData"];
}) {
  const { pageSize, queryTags, ...settings } = blockProps.settings;
  const { profileData, itemsData } = blockData;

  if (itemsData.isLoading || profileData.isLoading) {
    return (
      <Block {...blockProps} settings={settings}>
        <Loading />
      </Block>
    );
  }

  const profile = profileData.data.profile;
  const { items = [], totalCount = 0 } = itemsData.data as GetItemsResponse;

  return (
    <Block {...blockProps} settings={settings}>
      <HeadingLevelProvider>
        <DashBoardLayout profile={profile}>
          <SectionHeading
            text="Your Items"
            description="Manage your items here."
          >
            <ListSortControl />
            <ItemFilterControl />
          </SectionHeading>
          <ListNavigation
            pageSize={pageSize as number}
            totalCount={totalCount}
          />
          <Grid
            items={items.map((item: TItem) => (
              <ItemCard item={item} key={item.id} />
            ))}
            onEmpty={() => (
              <BasicCard
                title={
                  "No items found" +
                  (queryTags ? " with tag: " + queryTags : "")
                }
                description="Try adjusting your filters."
              />
            )}
          />
          <ListNavigation
            pageSize={pageSize as number}
            totalCount={totalCount}
          />
        </DashBoardLayout>
      </HeadingLevelProvider>
    </Block>
  );
}

function ItemCard({ item }: { item: TItem }) {
  const { id, sortName, publishedAt, expiredAt, updatedAt } = item;
  const getTags = useGetItemsTags(id);
  const tags = getTags.data?.tags || [];

  if (getTags.isLoading) {
    return <Loading />;
  }
  return (
    <EmptyCard>
      <div className="card-body md:flex-row gap-4 justify-between w-full">
        <div className="flex flex-col flex-grow justify-between gap-3">
          <Heading
            headingSize="xs"
            headingStyles="uppercase flex-none line-clamp-2"
          >
            {sortName}
          </Heading>
          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {tags.map((tag: TTag) => (
              <Text
                key={tag.id}
                textSize="xs"
                className="italic flex-none bg-neutral-content/10 px-1 rounded"
              >
                {tag.name}
              </Text>
            ))}
            <Text textSize="xs" className="italic flex-none w-full">
              Last updated:{" "}
              {dayjs(convertZuluToLocalDateTime(updatedAt)).format(
                techDatetime,
              )}
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Text textSize="xs">
            <ScheduleStatus publishedAt={publishedAt} expiredAt={expiredAt} />
          </Text>
          <div className="flex gap-1">
            <Button
              as="Link"
              to={paths.cmsItemUpdate.replace(":id", id.toString())}
              size="md"
              color="primary"
            >
              Edit
            </Button>
            <ItemRepublishForm
              formStyles="inline-flex"
              defaultValues={{ id, publishedAt, expiredAt }}
            />
            <ItemDeleteButton
              defaultValues={{ id }}
              handleSuccess={() => {
                toast.success("Item deleted successfully");
              }}
            />
          </div>
        </div>
      </div>
    </EmptyCard>
  );
}

const ItemFilterControl = () => {
  const getTags = useGetTags();
  const tagOptions = useMemo(
    () => [
      { id: "", label: "Filter by Tag" },
      ...(getTags.data?.tags || [])
        .map((tag: TTag) => ({
          id: tag.name,
          label: tag.name.toLocaleLowerCase(),
        }))
        .sort((a: { label: string }, b: { label: string }) =>
          a.label.localeCompare(b.label),
        ),
    ],
    [getTags.data],
  );
  const [initialTags] = useSearchParam("tags");

  const initialTagIndex = useMemo(() => {
    if (!initialTags) return 0;
    const foundIndex = tagOptions.findIndex(
      (option) => option.id === initialTags,
    );
    return foundIndex !== -1 ? foundIndex : 0;
  }, [initialTags, tagOptions]);

  const [, setSelectedTag] = useSearchParamWithDefault(
    "tags",
    tagOptions[initialTagIndex]?.id,
  );

  if (getTags.isLoading) {
    return <Loading />;
  }
  return (
    <DropDownMenu
      className="w-full sm:w-36"
      optionClasses="capitalize"
      value={tagOptions[initialTagIndex]}
      items={tagOptions}
      onChange={(item) => {
        setSelectedTag(item.id);
      }}
    />
  );
};
