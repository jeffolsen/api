import { TComponent } from "../../../network/component";
import {
  useGetItemById,
  useGetItemDateRanges,
  useGetItemImages,
  useGetItemsTags,
} from "../../../network/item";
import { BlockProps, BlockStandardProps } from "../Block";
import { NotFoundError } from "../../../utils/errors";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useItemUpdateBlockData({
  component,
  params,
}: BlockStandardProps): UseItemUpdateBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TItemUpdateBlockData["propertyValues"];

  const blockSettings = variants[variant] || variants["default"];

  const itemId = parseInt(params.id || "");
  const getItem = useGetItemById(itemId);
  const getTags = useGetItemsTags(itemId);
  const getImages = useGetItemImages(itemId);
  const getDateRanges = useGetItemDateRanges(itemId);

  if (getItem.error) {
    throw new NotFoundError();
  }
  if (getTags.error) {
    throw new NotFoundError();
  }
  if (getImages.error) {
    throw new NotFoundError();
  }
  if (getDateRanges.error) {
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
      itemData: getItem,
      tagsData: getTags,
      imagesData: getImages,
      dateRangesData: getDateRanges,
    },
  } as UseItemUpdateSuccessReturnType;
}

export default useItemUpdateBlockData;

type TItemUpdateBlockVariant = keyof typeof variants;

export type TItemUpdateBlockData = TComponent & {
  propertyValues: {
    variant: TItemUpdateBlockVariant;
    isPrimaryContent: boolean;
  };
};

export type UseItemUpdateFailedReturnType = {
  blockProps: never;
  blockData: never;
  error: unknown;
  params: Record<string, string>;
  path: string;
};

export type UseItemUpdateSuccessReturnType = {
  blockProps: BlockProps;
  blockData: {
    itemData: ReturnType<typeof useGetItemById>;
    tagsData: ReturnType<typeof useGetItemsTags>;
    imagesData: ReturnType<typeof useGetItemImages>;
    dateRangesData: ReturnType<typeof useGetItemDateRanges>;
  };
  error: never;
  params: never;
  path: never;
};

export type UseItemUpdateBlockDataReturnType =
  | UseItemUpdateFailedReturnType
  | UseItemUpdateSuccessReturnType;
