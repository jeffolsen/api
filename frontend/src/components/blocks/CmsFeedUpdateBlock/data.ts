import { TComponent } from "../../../network/component";
import { useGetComponentTypes } from "../../../network/componentType";
import {
  TSubjectType,
  useGetFeedById,
  useGetFeedComponents,
} from "../../../network/feed";
import { BlockProps, TBlockDataProps } from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedUpdateBlockData(feedProps?: TBlockDataProps) {
  const { feedComponent, pageProps } = feedProps || {};
  const component =
    feedComponent ||
    ({
      id: 1000,
      name: "Create a new feed",
      propertyValues: {
        variant: "default",
        isPrimaryContent: true,
      },
    } as TFeedUpdateBlockData);

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TFeedUpdateBlockData["propertyValues"];

  const feedId = parseInt(pageProps?.params?.id || "");
  const getFeed = useGetFeedById(feedId);
  const getFeedComponents = useGetFeedComponents(feedId);
  const getComponentTypes = useGetComponentTypes({
    ...(getFeed.data?.feed?.subjectType === "COLLECTION" && {
      subjectType: getFeed.data?.feed?.subjectType as TSubjectType,
    }),
  });

  if (getFeed.error) {
    return {
      error: getFeed.error,
    };
  }
  if (getFeedComponents.error) {
    return {
      error: getFeedComponents.error,
    };
  }
  if (getComponentTypes.error) {
    return {
      error: getComponentTypes.error,
    };
  }

  return {
    blockProps: {
      settings: variants[variant],
      id,
      title: name,
      isPrimaryContent,
    } as BlockProps,
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
