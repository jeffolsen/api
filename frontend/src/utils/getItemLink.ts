import { TFeed } from "@/network/feed";

const getItemLink = (feed: TFeed | undefined, itemId: number) => {
  if (feed?.subjectType === "SINGLE") return `/${feed.path}/${String(itemId)}`;
  return null;
};

export default getItemLink;
