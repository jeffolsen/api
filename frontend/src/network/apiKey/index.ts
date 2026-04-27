import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OTP_STATUS_KEY } from "@/network/verificationCode";
import {
  GENERATE_API_KEY_ENDPOINT,
  GET_PROFILES_API_KEYS_ENDPOINT,
  DESTROY_API_KEY_ENDPOINT,
  withErrorHandling,
} from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import {
  DestroyApiKeyInput,
  GenerateApiKeyInput,
} from "@/network/apiKey/types";
import { OTP_STATUS_NONE } from "@/network/verificationCode/types";

const API_KEYS_KEY = "apiKeys" as const;

export const useGetProfilesApiKeys = () => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [API_KEYS_KEY],
    queryFn: async () => {
      const response = await api.get(GET_PROFILES_API_KEYS_ENDPOINT);
      return response.data;
    },
  });
};

export const useGenerateApiKey = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateApiKeyInput) =>
      withErrorHandling(async () => {
        const { verificationCode, ...restData } = data;
        const headers = {
          "X-Verification-Code": verificationCode,
        };
        const response = await api.post(GENERATE_API_KEY_ENDPOINT, restData, {
          headers,
        });
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      queryClient.invalidateQueries({ queryKey: [API_KEYS_KEY] });
    },
  });
};

export const useDestroyApiKey = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DestroyApiKeyInput) =>
      withErrorHandling(async () => {
        const { verificationCode, ...restData } = data;
        const headers = {
          "X-Verification-Code": verificationCode,
        };
        const response = await api.post(DESTROY_API_KEY_ENDPOINT, restData, {
          headers,
        });
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      queryClient.invalidateQueries({ queryKey: [API_KEYS_KEY] });
    },
  });
};

export * from "@/network/apiKey/types";
