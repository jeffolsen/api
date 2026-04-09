import { TComponent } from "../../../network/component";

import {
  useGetItemById,
  useGetItemDateRanges,
  useGetItemImages,
  useGetItemsTags,
} from "../../../network/item";
import { BlockProps, TBlockDataProps } from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useItemUpdateBlockData(feedProps?: TBlockDataProps) {
  const { feedComponent, pageProps } = feedProps || {};
  const component =
    feedComponent ||
    ({
      id: 1000,
      name: "Edit item",
      propertyValues: {
        variant: "default",
        isPrimaryContent: true,
      },
    } as TItemUpdateBlockData);

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TItemUpdateBlockData["propertyValues"];

  const itemId = parseInt(pageProps?.params?.id || "");
  const getItem = useGetItemById(itemId);
  const getTags = useGetItemsTags(itemId);
  const getImages = useGetItemImages(itemId);
  const getDateRanges = useGetItemDateRanges(itemId);

  if (getItem.error) {
    return {
      error: getItem.error,
    };
  }
  if (getTags.error) {
    return {
      error: getTags.error,
    };
  }
  if (getImages.error) {
    return {
      error: getImages.error,
    };
  }
  if (getDateRanges.error) {
    return {
      error: getDateRanges.error,
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
      itemData: getItem,
      tagsData: getTags,
      imagesData: getImages,
      dateRangesData: getDateRanges,
    },
  };
}

export default useItemUpdateBlockData;

type TItemUpdateBlockVariant = keyof typeof variants;

export type TItemUpdateBlockData = TComponent & {
  propertyValues: {
    variant: TItemUpdateBlockVariant;
    isPrimaryContent: boolean;
  };
};
