import Block, { BlockStandardProps } from "../Block";
import Heading, { HeadingLevelProvider } from "../../common/Heading";
import Button from "../../common/Button";
import Loading from "../../common/Loading";
import DashBoardLayout from "../../layout/DashBoardLayout";
import { useGetAuthenticatedProfile } from "../../../network/profile";
import SectionHeading from "../../partials/SectionHeading";
import { TFeed, GetFeedsResponse, useGetFeeds } from "../../../network/feed";
import Grid from "../../common/Grid";
import BasicCard from "../../cards/BasicCard";
import EmptyCard from "../../cards/EmptyCard";
import { convertZuluToLocalDateTime } from "../../../utils/time";
import dayjs, { techDatetime } from "../../../utils/dayjs";
import Text from "../../common/Text";
import { ScheduleStatus } from "../../inputs/FormPublishSubmit";
import {
  FeedDeleteButton,
  FeedRepublishForm,
} from "../../forms/FeedCreateForm";
import { toast } from "react-hot-toast/headless";
import { ListNavigation, ListSortControl } from "../../partials/ListNavigation";
import {
  useSearchParam,
  useSearchParamWithDefault,
} from "../../../hooks/useSearchParam";
import DropDownMenu from "../../common/DropDownMenu";
import { useMemo } from "react";
import useFeedListBlockData, { UseFeedListSuccessReturnType } from "./data";
import { paths } from "../../../config/routes";

export default function Component({
  component,
  params,
  path,
}: BlockStandardProps) {
  const result = useFeedListBlockData({ component, params, path });
  const { blockProps, blockData, error } = result;

  if (error && !blockProps && !blockData) {
    return null;
  }

  return <CmsFeedsListBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsFeedsListBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseFeedListSuccessReturnType["blockProps"];
  blockData: UseFeedListSuccessReturnType["blockData"];
}) {
  const { pageSize, ...settings } = blockProps.settings;
  const { profileData, feedData } = blockData as {
    profileData: ReturnType<typeof useGetAuthenticatedProfile>;
    feedData: ReturnType<typeof useGetFeeds>;
  };

  if (profileData.isLoading || feedData.isLoading) {
    return (
      <Block {...blockProps} settings={settings}>
        <Loading />
      </Block>
    );
  }

  const profile = profileData.data.profile;
  const { feeds = [], totalCount = 0 } = feedData.data as GetFeedsResponse;

  return (
    <Block {...blockProps} settings={settings}>
      <HeadingLevelProvider>
        <DashBoardLayout profile={profile}>
          <SectionHeading
            text="Your Feeds"
            description="This lists all your created feeds. Click edit to update a feed or create a new one."
          >
            <ListSortControl
              sortOptions={[
                { id: "-updatedAt", label: "Updated At (Newest)" },
                { id: "updatedAt", label: "Updated At (Oldest)" },
              ]}
            />
            <FeedFilterControl />
          </SectionHeading>
          <ListNavigation
            pageSize={pageSize as number}
            totalCount={totalCount}
            text="New Feed"
            newPath={paths.cmsFeedCreate}
          />
          <Grid
            items={feeds.map((feed: TFeed) => (
              <FeedCard feed={feed} key={feed.id} />
            ))}
            onEmpty={() => <BasicCard title={"No feeds found"} />}
          />
          <ListNavigation
            pageSize={pageSize as number}
            totalCount={totalCount}
            text="New Feed"
            newPath={paths.cmsFeedCreate}
          />
        </DashBoardLayout>
      </HeadingLevelProvider>
    </Block>
  );
}

function FeedCard({ feed }: { feed: TFeed }) {
  const { id, path, subjectType, publishedAt, expiredAt } = feed;

  return (
    <EmptyCard>
      <div className="card-body md:flex-row gap-4 justify-between w-full">
        <div className="flex flex-col flex-grow justify-between gap-3">
          <Heading
            headingSize="xs"
            headingStyles="uppercase flex-none line-clamp-2"
          >
            {`${path}${subjectType === "SINGLE" ? "/:id" : ""}`}
          </Heading>
          <Text textSize="xs" className="italic flex-none">
            Last updated:{" "}
            {dayjs(convertZuluToLocalDateTime(feed.updatedAt)).format(
              techDatetime,
            )}
          </Text>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Text textSize="xs">
            <ScheduleStatus publishedAt={publishedAt} expiredAt={expiredAt} />
          </Text>
          <div className="flex gap-1">
            <Button
              as="Link"
              to={paths.cmsFeedUpdate.replace(":id", id.toString())}
              size="md"
              color="primary"
            >
              Edit
            </Button>
            <FeedRepublishForm
              formStyles="inline-flex"
              defaultValues={{ id, publishedAt, expiredAt }}
            />
            <FeedDeleteButton
              defaultValues={{ id }}
              handleSuccess={() => {
                toast.success("Feed deleted successfully");
              }}
            />
          </div>
        </div>
      </div>
    </EmptyCard>
  );
}

const FeedFilterControl = () => {
  const subjectOptions = useMemo(
    () => [
      { id: "", label: "Filter by Subject Type" },
      { id: "SINGLE", label: "Single Subject" },
      { id: "COLLECTION", label: "Collection" },
    ],
    [],
  );
  const [initialSubjects] = useSearchParam("subjectTypes");

  const initialTagIndex = useMemo(() => {
    if (!initialSubjects) return 0;
    const foundIndex = subjectOptions.findIndex(
      (option) => option.id === initialSubjects,
    );
    return foundIndex !== -1 ? foundIndex : 0;
  }, [initialSubjects, subjectOptions]);

  const [, setSelectedTag] = useSearchParamWithDefault(
    "subjectTypes",
    subjectOptions[initialTagIndex]?.id,
  );

  return (
    <DropDownMenu
      className="w-full sm:w-48"
      optionClasses="capitalize"
      value={subjectOptions[initialTagIndex]}
      items={subjectOptions}
      onChange={(item) => {
        setSelectedTag(item.id);
      }}
    />
  );
};
