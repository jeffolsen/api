import { TItem } from "@/network/item";

const getItemLink = (feed: string | undefined, item: TItem) => {
  if (item.overrideLink) return `/${item.overrideLink}`;
  if (feed) return `/${feed}/${String(item.id)}`;
  return null;
};

export const getLinkLabel = (link: string | null) => {
  const linkFragments = (link?.split("/").filter(Boolean) || []) as string[];

  if (linkFragments.length < 1) return null;

  const lastItem = linkFragments.pop();

  // numbers are ids so this is a link to single subject
  if (!isNaN(parseFloat(lastItem as string))) {
    // there will be at least one more fragment
    const lastItem = linkFragments.pop();

    if (!lastItem) return null;

    return lastItem;
  }

  if (!lastItem) return null;

  return lastItem;
};
export default getItemLink;
