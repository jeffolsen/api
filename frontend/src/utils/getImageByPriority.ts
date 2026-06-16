import { TImage } from "@/network/image/types";
import siteIcon from "./siteIcon";

type ImageTypes = "ICON" | "PORTRAIT" | "LANDSCAPE";
type PriorityValues = 0 | 1 | 2 | 3;

type Priority = Record<ImageTypes, PriorityValues>;

const getImageByPriority = ({
  images,
  priority = { LANDSCAPE: 1, PORTRAIT: 0, ICON: 0 },
}: {
  images: TImage[];
  priority?: Priority;
}): TImage | null => {
  const sIcon = siteIcon();
  if (priority.ICON > 0) images.push(sIcon);
  return (
    [...images]
      .filter(Boolean)
      .filter(({ type }: TImage) => {
        return (
          Object.hasOwn(priority, type) && priority[type as ImageTypes] !== 0
        );
      })
      .sort(
        (a, b) =>
          priority[a.type as ImageTypes] - priority[b.type as ImageTypes],
      )?.[0] || null
  );
};

export default getImageByPriority;
