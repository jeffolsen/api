import { TItem } from "@/network/item/types";

const sortItemALlowList = <T extends TItem>({
  items,
  itemSlugs,
}: {
  items: T[];
  itemSlugs: string[];
}): T[] => {
  return items.sort(
    (a: T, b: T) =>
      itemSlugs.indexOf(a.slug) - itemSlugs.indexOf(b.slug),
  );
};

export default sortItemALlowList;
