import Block, { BlockProps } from "./Block";
import Grid from "../common/Grid";
import { useGetItems, TItem } from "../../network/item";
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

function ItemsListBlock(props: BlockProps) {
  const getItems = useGetItems({ page: 1, pageSize: 3 });
  const getProfile = useGetAuthenticatedProfile();
  const profile = getProfile.data?.profile;
  const { items = [], totalCount = 0 } =
    (getItems.data as { items?: TItem[]; totalCount?: number }) || {};

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
            description="This lists all your created items. Click edit to update an item or create a new one."
          >
            <p>{totalCount} items found</p>
            <Button
              as="Link"
              to="/items/new"
              size="md"
              color="primary"
              className="w-full md:w-auto"
            >
              Create New Item
            </Button>
          </SectionHeading>
          <Grid
            items={items.map((item: TItem) => (
              <ItemCard item={item} key={item.id} />
            ))}
          />
        </DashBoardLayout>
      </HeadingLevelProvider>
    </Block>
  );
}

function ItemCard({ item }: { item: TItem }) {
  const { id, sortName, publishedAt, expiredAt, updatedAt } = item;
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
          <Text textSize="xs" className="italic flex-none">
            Last updated:{" "}
            {dayjs(convertZuluToLocalDateTime(updatedAt)).format(techDatetime)}
          </Text>
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

export default ItemsListBlock;
