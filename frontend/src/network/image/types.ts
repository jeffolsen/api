export const IMAGES_KEY = "images" as const;

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
  alt: string;
  attribution: string | null;
  attributionLink: string | null;
  type: TImageType;
  createdAt: string;
  updatedAt: string;
};

export type TImageInput = Omit<TImage, "id" | "createdAt" | "updatedAt">;

export type GetImagesResponse = {
  images: TImage[];
};
