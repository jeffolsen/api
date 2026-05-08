import { useQuery } from "@tanstack/react-query";
import { IMAGES_ENDPOINT } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { IMAGES_KEY, GetImagesResponse } from "./types";

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
