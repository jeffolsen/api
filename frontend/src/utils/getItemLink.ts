import { TItem } from "@/network/item/types";

const getItemLink = (feed: string | undefined, item: TItem) => {
  if (item.overrideLink) return `/${item.overrideLink}`;
  if (feed) return `/${feed}/${String(item.slug)}`;
  return null;
};

export const getLinkLabel = (link: string | null) => {
  const linkFragments = (link?.split("/").filter(Boolean) || []) as string[];

  if (linkFragments.length < 1) return null;

  let lastItem = linkFragments.pop();

  // numbers are ids
  if (!isNaN(parseFloat(lastItem as string))) {
    // there will be at least one more fragment
    lastItem = linkFragments.pop();
  }

  if (!lastItem) return null;

  return lastItem.replace(/[-\d]+/g, " ").trim();
};

export default getItemLink;
