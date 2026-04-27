import { useGetComponentTypes } from "@/network/componentType";
import {
  TSubjectType,
  useGetFeedById,
  useGetFeedComponents,
} from "@/network/feed";
import {
  BlockProps,
  BlockData,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedUpdateBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps) {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  const feedId = parseInt(params?.id || "");
  const getFeed = useGetFeedById(feedId);
  const getFeedComponents = useGetFeedComponents(feedId);
  const getComponentTypes = useGetComponentTypes({
    ...(getFeed.data?.feed?.subjectType === "COLLECTION" && {
      subjectType: getFeed.data?.feed?.subjectType as TSubjectType,
    }),
  });

  if (getFeed.error) {
    return {
      type: "error" as const,
      error: "Failed to fetch feed data",
      params,
      path,
    };
  }
  if (getFeedComponents.error) {
    return {
      type: "error" as const,
      error: "Failed to fetch feed components data",
      params,
      path,
    };
  }
  if (getComponentTypes.error) {
    return {
      type: "error" as const,
      error: "Failed to fetch component types data",
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
        isPrimaryContent,
      },
      name,
    },
    blockData: {
      id,
      feedData: getFeed,
      feedComponentsData: getFeedComponents,
      componentTypesData: getComponentTypes,
    },
  };
}

export default useFeedUpdateBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = {
  feedData: ReturnType<typeof useGetFeedById>;
  feedComponentsData: ReturnType<typeof useGetFeedComponents>;
  componentTypesData: ReturnType<typeof useGetComponentTypes>;
};

export type UseFeedUpdateBlockProps = BlockProps<BlockSettings>;
export type UseFeedUpdateBlockData = BlockData<LocalBlockData>;
export type UseFeedUpdateBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
