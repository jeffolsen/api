import { useQuery } from "@tanstack/react-query";
import { IMAGES_ENDPOINT } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { GetImagesResponse } from "@/network/image/types";

export const IMAGES_KEY = "images" as const;

export const useGetImages = () => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [IMAGES_KEY],
    queryFn: async (): Promise<GetImagesResponse> => {
      const response = await api.get(IMAGES_ENDPOINT);
      return response.data;
    },
  });
};

export * from "@/network/image/types";
