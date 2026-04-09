import { TComponent } from "../../../network/component";
import { useGetAuthenticatedProfile } from "../../../network/profile";
import { BlockProps, TBlockDataProps } from "../Block";
import { useSearchParam } from "../../../hooks/useSearchParam";
import { TFeedSort, TSubjectType, useGetFeeds } from "../../../network/feed";

const variants = {
  default: {
    width: "lg",
    pageSize: 3,
  },
} as const;

function useFeedListBlockData(feedProps?: TBlockDataProps) {
  const { feedComponent } = feedProps || {};
  const component =
    feedComponent ||
    ({
      id: 1000,
      name: "Feeds List",
      propertyValues: {
        variant: "default",
        isPrimaryContent: true,
      },
    } as TFeedListBlockData);

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TFeedListBlockData["propertyValues"];

  const { pageSize, ...blockSettings } = variants[variant];

  const profile = useGetAuthenticatedProfile();

  const [page] = useSearchParam("page");
  const [subjectTypes] = useSearchParam("subjectTypes");
  const [sort] = useSearchParam("sort");

  const feeds = useGetFeeds({
    pageSize,
    page: page ? parseInt(page) : 1,
    subjectTypes: subjectTypes?.split(",") as TSubjectType[],
    sort: sort?.split(",") as TFeedSort[],
  });

  if (profile.error) {
    return {
      error: profile.error,
    };
  }

  if (feeds.error) {
    return {
      error: feeds.error,
    };
  }

  return {
    blockProps: {
      settings: {
        ...blockSettings,
        pageSize,
        isPrimaryContent,
      },
      id,
      title: name,
      isPrimaryContent,
    } as Omit<BlockProps, "id"> & {
      settings: BlockProps["settings"] & { pageSize: number };
    },
    blockData: { profileData: profile, feedData: feeds },
  };
}

export default useFeedListBlockData;

type TFeedListBlockVariant = keyof typeof variants;

export type TFeedListBlockData = TComponent & {
  propertyValues: {
    variant: TFeedListBlockVariant;
    isPrimaryContent: boolean;
  };
};

export type UseFeedListBlockDataReturnType =
  | {
      blockProps: Omit<BlockProps, "id"> & {
        settings: BlockProps["settings"] & { pageSize: number };
      };
      blockData: {
        profileData: ReturnType<typeof useGetAuthenticatedProfile>;
        feedData: ReturnType<typeof useGetFeeds>;
      };
    }
  | {
      error: Error;
    };
