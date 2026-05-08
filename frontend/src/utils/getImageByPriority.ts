import { TImage } from "@/network/image/types";

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
  return (
    images
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
