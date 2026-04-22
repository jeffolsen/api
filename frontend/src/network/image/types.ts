export const imageTypes = [
  "ICON",
  "LANDSCAPE",
  "PORTRAIT",
  "OTHER",
  "",
] as const;

export type TImageType = (typeof imageTypes)[number];

export type TImage = {
  id: number;
  url: string;
  type: TImageType;
  alt: string;
  createdAt: string;
  updatedAt: string;
};

export type TImageInput = Omit<TImage, "id" | "createdAt" | "updatedAt">;

export type GetImagesResponse = {
  images: TImage[];
};
