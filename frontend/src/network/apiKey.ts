import { useMutation, useQuery } from "@tanstack/react-query";
import {
  GENERATE_API_KEY_ENDPOINT,
  CONNECT_API_KEY_ENDPOINT,
  GET_PROFILES_API_KEYS_ENDPOINT,
} from "./api";
import { useAuthState } from "../contexts/AuthContext";

const API_KEYS_KEY = "profile" as const;

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

export const useGenerate = () => {
  const { api } = useAuthState();

  return useMutation({
    mutationFn: async (data: GenerateApiKeyInput) => {
      const response = await api.post(GENERATE_API_KEY_ENDPOINT, data);
      return response.data;
    },
    onSuccess: () => {
      console.log("congrats you generated an api key");
    },
    onError: (error) => {
      console.error("useGenerate", error);
    },
  });
};

type ConnectApiKeyInput = {
  apiSlug: string;
  apiKey: string;
};

export const useConnect = () => {
  const { api } = useAuthState();

  return useMutation({
    mutationFn: async (data: ConnectApiKeyInput) => {
      const response = await api.post(CONNECT_API_KEY_ENDPOINT, data);
      return response.data;
    },
    onSuccess: () => {
      console.log("congrats you connected with an api key");
    },
    onError: (error) => {
      console.error("useConnect", error);
    },
  });
};
