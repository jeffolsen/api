import { keepPreviousData } from "@tanstack/react-query";
import { useGetAuthenticatedProfile } from "@/network/profile";
import {
  BlockProps,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
  BlockData,
} from "@/components/blocks/Block";
import { useSearchParam } from "@/hooks/useSearchParam";
import { TFeedSort, TSubjectType, useGetFeeds } from "@/network/feed";

const variants = {
  default: {
    width: "lg",
    pageSize: 5,
  },
} as const;

function useFeedListBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseFeedUpdateBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const { pageSize, ...blockSettings } =
    variants[variant] || variants["default"];

  const profile = useGetAuthenticatedProfile();

  const [page] = useSearchParam("page");
  const [subjectTypes] = useSearchParam("subjectTypes");
  const [sort] = useSearchParam("sort");

  const feeds = useGetFeeds(
    {
      pageSize,
      page: page ? parseInt(page) : 1,
      subjectTypes: subjectTypes?.split(",") as TSubjectType[],
      sort: sort?.split(",") as TFeedSort[],
    },
    { placeholderData: keepPreviousData },
  );

  if (profile.error) {
    return {
      type: "error" as const,
      error: "Failed to load profile data",
      params,
      path,
    };
  }

  if (feeds.error) {
    return {
      type: "error" as const,
      error: "Failed to load feed data",
      params,
      path,
    };
  }

  return {
    type: "success" as const,
    blockProps: {
      settings: {
        ...blockSettings,
        critical,
        pageSize,
        isPrimaryContent,
      },
      name,
    },
    blockData: { id, profileData: profile, feedData: feeds },
  };
}

export default useFeedListBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = {
  profileData: ReturnType<typeof useGetAuthenticatedProfile>;
  feedData: ReturnType<typeof useGetFeeds>;
};

export type UseFeedUpdateBlockProps = BlockProps<BlockSettings>;
export type UseFeedUpdateBlockData = BlockData<LocalBlockData>;
export type UseFeedUpdateBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
