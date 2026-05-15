import { useQuery } from "@tanstack/react-query";
import { VERIFICATION_CODE_ENDPOINT } from "@/network/clients/api";
import { useAuthState } from "@/contexts/AuthContext";
import { VERIFICATION_CODES_KEY } from "./types";

export const useGetProfileVerificationCodes = () => {
  const { api } = useAuthState();

  const query = useQuery({
    queryKey: [VERIFICATION_CODES_KEY],
    queryFn: async () => {
      const response = await api.get(VERIFICATION_CODE_ENDPOINT);
      return response.data;
    },
  });

  return query;
};
