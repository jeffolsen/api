import { keepPreviousData } from "@tanstack/react-query";
import { useGetAuthenticatedProfile } from "@/network/profile/useGetAuthenticatedProfile";
import { TItemSort } from "@/network/item/types";
import { useGetItems } from "@/network/item/useGetItems";
import { TTagName } from "@/network/tag/types";
import {
  BlockProps,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
  BlockData,
} from "@/components/blocks/Block";
import { useSearchParam } from "@/hooks/useSearchParam";
import handleBlockError from "@/utils/handleBlockError";

const variants = {
  default: {
    width: "lg",
    pageSize: 10,
  },
} as const;

function useItemListBlockData({
  component,
  critical,
}: BlockComponentStandardProps): UseItemListBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const { pageSize, ...blockSettings } =
    variants[variant] || variants["default"];

  const profile = useGetAuthenticatedProfile();

  const [page] = useSearchParam("page");
  const [tags] = useSearchParam("tags");
  const [sort] = useSearchParam("sort");
  const items = useGetItems({
    clientType: "user",
    queryParams: {
      pageSize,
      privateOnly: true,
      page: page ? parseInt(page) : 1,
      tags: tags?.split(",") as TTagName[],
      sort: sort?.split(",") as TItemSort[],
    },
    options: { placeholderData: keepPreviousData },
  });

  if (profile.error) {
    handleBlockError(profile.error);
  }

  if (items.error) {
    handleBlockError(items.error);
  }

  return {
    type: "success" as const,
    blockProps: {
      settings: {
        ...blockSettings,
        critical,
        isPrimaryContent,
        pageSize,
      },
      name,
    },
    blockData: { id, profileData: profile, itemsData: items },
  };
}

export default useItemListBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = {
  profileData: ReturnType<typeof useGetAuthenticatedProfile>;
  itemsData: ReturnType<typeof useGetItems>;
};

export type UseItemListBlockProps = BlockProps<BlockSettings>;
export type UseItemListBlockData = BlockData<LocalBlockData>;
export type UseItemListBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
