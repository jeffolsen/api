const getItemLink = (feedPath: string | undefined, itemId: number) => {
  if (!feedPath) return null;
  return feedPath.replace(":id", String(itemId));
};

export default getItemLink;
