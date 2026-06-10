import { TImage } from "@/network/image/types";

const siteIcon = (): TImage => {
  return {
    id: 10001000,
    url: "/images/favicon-512x512.png",
    type: "ICON",
    alt: "meetjeffolsen",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export default siteIcon;
