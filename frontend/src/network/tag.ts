import { useQuery } from "@tanstack/react-query";
import { TAGS_ENDPOINT } from "./api";
import { useAuthState } from "../contexts/AuthContext";

const TAGS_KEY = "tags" as const;

export const useGetTags = () => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [TAGS_KEY],
    queryFn: async () => {
      const response = await api.get(TAGS_ENDPOINT);
      return response.data;
    },
  });
};
