import { useQuery } from "@tanstack/react-query";
import { PROFILE_ENDPOINT } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { PROFILE_KEY } from "./types";

export const useGetAuthenticatedProfile = () => {
  const { api } = useAuthState();

  const query = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: async () => {
      const response = await api.get(PROFILE_ENDPOINT);
      return response.data;
    },
  });

  return query;
};
