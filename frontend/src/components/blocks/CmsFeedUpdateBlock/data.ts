import { TComponent } from "../../../network/component";
import { useGetComponentTypes } from "../../../network/componentType";
import {
  TSubjectType,
  useGetFeedById,
  useGetFeedComponents,
} from "../../../network/feed";
import { BlockProps, BlockStandardProps } from "../Block";
import { NotFoundError } from "../../../utils/errors";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedUpdateBlockData({ component, params }: BlockStandardProps) {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TFeedUpdateBlockVariant;
    isPrimaryContent: boolean;
  };

  const blockSettings = variants[variant] || variants["default"];

  const feedId = parseInt(params.id || "");
  const getFeed = useGetFeedById(feedId);
  const getFeedComponents = useGetFeedComponents(feedId);
  const getComponentTypes = useGetComponentTypes({
    ...(getFeed.data?.feed?.subjectType === "COLLECTION" && {
      subjectType: getFeed.data?.feed?.subjectType as TSubjectType,
    }),
  });

  if (getFeed.error) {
    throw new NotFoundError();
  }
  if (getFeedComponents.error) {
    throw new NotFoundError();
  }
  if (getComponentTypes.error) {
    throw new NotFoundError();
  }

  return {
    blockProps: {
      settings: {
        ...blockSettings,
        isPrimaryContent,
      },
      id,
      title: name,
    },
    blockData: {
      feedData: getFeed,
      feedComponentsData: getFeedComponents,
      componentTypesData: getComponentTypes,
    },
  };
}

export default useFeedUpdateBlockData;

type TFeedUpdateBlockVariant = keyof typeof variants;

export type TFeedUpdateBlockData = TComponent & {
  propertyValues: {
    variant: TFeedUpdateBlockVariant;
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
  blockProps: Omit<BlockProps, "id"> & {
    settings: BlockProps["settings"];
  };
  blockData: {
    feedData: ReturnType<typeof useGetFeedById>;
    feedComponentsData: ReturnType<typeof useGetFeedComponents>;
    componentTypesData: ReturnType<typeof useGetComponentTypes>;
  };
  error: never;
  params: never;
  path: never;
};

export type UseFeedListBlockDataReturnType =
  | UseFeedListFailedDataReturnType
  | UseFeedListSuccessReturnType;
