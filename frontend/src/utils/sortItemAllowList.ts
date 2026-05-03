import { TItem } from "@/network/item";

const sortItemALlowList = ({
  items,
  itemSlugs,
}: {
  items: TItem[];
  itemSlugs: string[];
}) => {
  return items.sort(
    (a: TItem, b: TItem) =>
      itemSlugs.indexOf(a.slug) - itemSlugs.indexOf(b.slug),
  );
};

export default sortItemALlowList;
