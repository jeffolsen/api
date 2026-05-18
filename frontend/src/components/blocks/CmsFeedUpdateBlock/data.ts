import { useGetComponentTypes } from "@/network/componentType/useGetComponentTypes";
import { TSubjectType } from "@/network/feed/types";
import { useGetFeedById } from "@/network/feed/useGetFeedById";
import { useGetFeedComponents } from "@/network/feed/useGetFeedComponents";
import {
  BlockProps,
  BlockData,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import handleBlockError from "@/utils/handleBlockError";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedUpdateBlockData({
  component,
  params,
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
    handleBlockError(getFeed.error);
  }
  if (getFeedComponents.error) {
    handleBlockError(getFeedComponents.error);
  }
  if (getComponentTypes.error) {
    handleBlockError(getComponentTypes.error);
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
