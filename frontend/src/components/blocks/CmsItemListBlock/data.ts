import { TComponent } from "../../../network/component";
import { useGetAuthenticatedProfile } from "../../../network/profile";
import { useGetItems, TItemSort } from "../../../network/item";
import { TTagName } from "../../../network/tag";
import { BlockProps, BlockStandardProps } from "../Block";
import { useSearchParam } from "../../../hooks/useSearchParam";

const variants = {
  default: {
    width: "lg",
    pageSize: 10,
    privateOnly: true,
  },
} as const;

function useItemListBlockData({
  component,
  params,
  path,
}: BlockStandardProps): UseItemListBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TItemListBlockData["propertyValues"];

  const { pageSize, privateOnly, ...blockSettings } =
    variants[variant] || variants["default"];

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
      params,
      path,
    } as UseItemListFailedReturnType;
  }

  if (items.error) {
    return {
      error: items.error,
      params,
      path,
    } as UseItemListFailedReturnType;
  }

  return {
    blockProps: {
      settings: {
        ...blockSettings,
        isPrimaryContent,
        pageSize,
        queryTags: tags,
      },
      id,
      title: name,
    },
    blockData: { profileData: profile, itemsData: items },
  } as UseItemListSuccessReturnType;
}

export default useItemListBlockData;

type TItemListBlockVariant = keyof typeof variants;

export type TItemListBlockData = TComponent & {
  propertyValues: {
    variant: TItemListBlockVariant;
    isPrimaryContent: boolean;
  };
};

export type UseItemListFailedReturnType = {
  blockProps: never;
  blockData: never;
  error: unknown;
  params: Record<string, string>;
  path: string;
};

export type UseItemListSuccessReturnType = {
  blockProps: BlockProps & {
    settings: BlockProps["settings"] & {
      pageSize: number;
      queryTags: string | undefined;
    };
  };
  blockData: {
    profileData: ReturnType<typeof useGetAuthenticatedProfile>;
    itemsData: ReturnType<typeof useGetItems>;
  };
  error: never;
  params: never;
  path: never;
};

export type UseItemListBlockDataReturnType =
  | UseItemListFailedReturnType
  | UseItemListSuccessReturnType;
