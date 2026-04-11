import { TComponent } from "../../../network/component";
import { useGetAuthenticatedProfile } from "../../../network/profile";
import { BlockProps, BlockStandardProps } from "../Block";
import { useSearchParam } from "../../../hooks/useSearchParam";
import { TFeedSort, TSubjectType, useGetFeeds } from "../../../network/feed";

const variants = {
  default: {
    width: "lg",
    pageSize: 3,
  },
} as const;

function useFeedListBlockData({
  component,
  params,
  path,
}: BlockStandardProps): UseFeedListBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TFeedListBlockVariant;
    isPrimaryContent: boolean;
  };

  const { pageSize, ...blockSettings } =
    variants[variant] || variants["default"];

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
      error: "Failed to load profile data",
      params,
      path,
    } as UseFeedListFailedDataReturnType;
  }

  if (feeds.error) {
    return {
      error: "Failed to load feed data",
      params,
      path,
    } as UseFeedListFailedDataReturnType;
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
    },
    blockData: { profileData: profile, feedData: feeds },
  } as UseFeedListSuccessReturnType;
}

export default useFeedListBlockData;

type TFeedListBlockVariant = keyof typeof variants;

export type TFeedListBlockData = TComponent & {
  propertyValues: {
    variant: TFeedListBlockVariant;
    isPrimaryContent: boolean;
  };
};

export type UseFeedListFailedDataReturnType = {
  blockProps: never;
  blockData: never;
  error: string;
  params: Record<string, string>;
  path: string;
};

export type UseFeedListSuccessReturnType = {
  blockProps: BlockProps & {
    settings: BlockProps["settings"] & { pageSize: number };
  };
  blockData: {
    profileData: ReturnType<typeof useGetAuthenticatedProfile>;
    feedData: ReturnType<typeof useGetFeeds>;
  };
  error: never;
  params: never;
  path: never;
};

export type UseFeedListBlockDataReturnType =
  | UseFeedListFailedDataReturnType
  | UseFeedListSuccessReturnType;
