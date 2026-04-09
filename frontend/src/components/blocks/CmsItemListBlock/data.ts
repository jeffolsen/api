import { TComponent } from "../../../network/component";
import { useGetAuthenticatedProfile } from "../../../network/profile";
import { useGetItems, TItemSort } from "../../../network/item";
import { TTagName } from "../../../network/tag";
import { BlockProps, TBlockDataProps } from "../Block";
import { useSearchParam } from "../../../hooks/useSearchParam";

const variants = {
  default: {
    width: "lg",
    pageSize: 3,
    privateOnly: true,
  },
} as const;

function useItemListBlockData(feedProps?: TBlockDataProps) {
  const { feedComponent } = feedProps || {};
  const component =
    feedComponent ||
    ({
      id: 1000,
      name: "Items List",
      propertyValues: {
        variant: "default",
        isPrimaryContent: true,
      },
    } as TItemListBlockData);

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TItemListBlockData["propertyValues"];

  const { pageSize, privateOnly, ...blockSettings } = variants[variant];

  const profile = useGetAuthenticatedProfile();

  const [page] = useSearchParam("page");
  const [tags] = useSearchParam("tags");
  const [sort] = useSearchParam("sort");
  const items = useGetItems({
    pageSize,
    privateOnly,
    page: page ? parseInt(page) : 1,
    tags: tags?.split(",") as TTagName[],
    sort: sort?.split(",") as TItemSort[],
  });

  if (profile.error) {
    return {
      error: profile.error,
    };
  }

  if (items.error) {
    return {
      error: items.error,
    };
  }

  return {
    blockProps: {
      settings: { ...blockSettings, pageSize, queryTags: tags },
      id,
      title: name,
      isPrimaryContent,
    } as BlockProps,
    blockData: { profileData: profile, itemsData: items },
  };
}

export default useItemListBlockData;

type TItemListBlockVariant = keyof typeof variants;

export type TItemListBlockData = TComponent & {
  propertyValues: {
    variant: TItemListBlockVariant;
    isPrimaryContent: boolean;
  };
};
