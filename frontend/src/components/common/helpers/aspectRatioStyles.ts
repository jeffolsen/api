export const aspectRatios = {
  none: "w-full h-full",
  natural: "w-full h-auto",
  ".5": "w-full pb-[200%]",
  ".66": "w-full pb-[150%]",
  "1": "w-full pb-[100%]",
  "1.5": "w-full pb-[66%]",
  "2": "w-full pb-[50%]",
};

export type AspectRatio = keyof typeof aspectRatios;
