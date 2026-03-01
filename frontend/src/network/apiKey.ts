import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OTP_STATUS_KEY, OTP_STATUS_NONE } from "./verificationCode";
import {
  GENERATE_API_KEY_ENDPOINT,
  CONNECT_API_KEY_ENDPOINT,
  GET_PROFILES_API_KEYS_ENDPOINT,
  DESTROY_API_KEY_ENDPOINT,
  withErrorHandling,
} from "./api";
import { useAuthState } from "../contexts/AuthContext";

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

export type GenerateApiKeyInput = {
  apiSlug: string;
  origin: string;
  verificationCode: string;
};

export const useGenerateApiKey = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateApiKeyInput) =>
      withErrorHandling(async () => {
        const response = await api.post(GENERATE_API_KEY_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      queryClient.invalidateQueries({ queryKey: [API_KEYS_KEY] });
    },
  });
};

export type DestroyApiKeyInput = {
  apiSlug: string;
};

export const useDestroyApiKey = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DestroyApiKeyInput) =>
      withErrorHandling(async () => {
        const response = await api.post(DESTROY_API_KEY_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      queryClient.invalidateQueries({ queryKey: [API_KEYS_KEY] });
    },
  });
};

export type ConnectApiKeyInput = {
  apiSlug: string;
  apiKey: string;
};

export const useConnectApiKey = () => {
  const { api } = useAuthState();

  return useMutation({
    mutationFn: async (data: ConnectApiKeyInput) =>
      withErrorHandling(async () => {
        const response = await api.post(CONNECT_API_KEY_ENDPOINT, data);
        return response.data;
      }),
  });
};
