import { useQuery } from "@tanstack/react-query";
import { IMAGES_ENDPOINT } from "./api";
import { useAuthState } from "../contexts/AuthContext";

export const IMAGES_KEY = "images" as const;

export const useGetImages = () => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [IMAGES_KEY],
    queryFn: async () => {
      const response = await api.get(IMAGES_ENDPOINT);
      return response.data;
    },
  });
};

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
};
