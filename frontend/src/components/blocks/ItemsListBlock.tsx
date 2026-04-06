import Block, { BlockProps } from "./Block";
import Grid from "../common/Grid";
import {
  useGetItems,
  TItem,
  useGetItemsTags,
  TItemSort,
  GetItemsResponse,
} from "../../network/item";
import EmptyCard from "../cards/EmptyCard";
import Heading, { HeadingLevelProvider } from "../common/Heading";
import Text from "../common/Text";
import { convertZuluToLocalDateTime } from "../../utils/time";
import dayjs, { techDatetime } from "../../utils/dayjs";
import { ItemDeleteButton, ItemRepublishForm } from "../forms/ItemCreateForm";
import { toast } from "react-hot-toast/headless";
import Button from "../common/Button";
import Loading from "../common/Loading";
import DashBoardLayout from "../layout/DashBoardLayout";
import { useGetAuthenticatedProfile } from "../../network/profile";
import SectionHeading from "../partials/SectionHeading";
import { ScheduleStatus } from "../inputs/FormPublishSubmit";
import DropDownMenu from "../common/DropDownMenu";
import {
  useSearchParamWithDefault,
  useSearchParam,
} from "../../hooks/useSearchParam";
import { TTag, TTagName, useGetTags } from "../../network/tag";
import { useMemo } from "react";
import { ListNavigation, ListSortControl } from "../partials/ListNavigation";
import BasicCard from "../cards/BasicCard";

function ItemsListBlock(props: BlockProps) {
  const initialPageSize = 3;
  const [page] = useSearchParam("page");
  const [tags] = useSearchParam("tags");
  const [sort] = useSearchParam("sort");
  const getItems = useGetItems({
    privateOnly: true,
    page: page ? parseInt(page) : 1,
    pageSize: initialPageSize,
    tags: tags?.split(",") as TTagName[],
    sort: sort?.split(",") as TItemSort[],
  });
  const getProfile = useGetAuthenticatedProfile();
  const profile = getProfile.data?.profile;
  const { items = [], totalCount = 0 } =
    (getItems.data as GetItemsResponse) || {};

  if (getItems.isLoading || getProfile.isLoading || !profile?.email) {
    return (
      <Block {...props}>
        <Loading />
      </Block>
    );
  }

  return (
    <Block {...props}>
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
            initialPageSize={initialPageSize}
            totalCount={totalCount}
          />
          <Grid
            items={items.map((item: TItem) => (
              <ItemCard item={item} key={item.id} />
            ))}
            onEmpty={() => (
              <BasicCard
                title={"No items found" + (tags ? " with tag: " + tags : "")}
                description="Try adjusting your filters."
              />
            )}
          />
          <ListNavigation
            initialPageSize={initialPageSize}
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
            <Button as="Link" to={`/items/${id}`} size="md" color="primary">
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

export default ItemsListBlock;
