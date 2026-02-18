import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { OTP_STATUS_CREATE_API_KEY, OTP_STATUS_KEY } from "./verificationCode";
import { api } from "./api";

export const GENERATE_API_KEY_URL = "/keys/generate";
export const CONNECT_API_KEY_URL = "/keys/public";
export const GET_PROFILES_API_KEYS_URL = "/keys";

const API_KEYS_KEY = "profile" as const;

export const getProfilesApiKeys = async () => {
  const response = await api.get(GET_PROFILES_API_KEYS_URL);
  return response.data;
};

export const useGetProfilesApiKeys = () => {
  return useQuery({
    queryKey: [API_KEYS_KEY],
    queryFn: getProfilesApiKeys,
  });
};

export type RequestGenerateApiKeyInput = {
  email: string;
  password: string;
};

export const requestGenerateApiKey = async (
  data: RequestGenerateApiKeyInput,
) => {
  const response = await api.post(GENERATE_API_KEY_URL, data);
  return response.data;
};

export const useRequestGenerateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestGenerateApiKey,
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_CREATE_API_KEY);
    },
    onError: (error) => {
      console.error("useRequestGenerateApiKey", error);
    },
  });
};

export type GenerateApiKeyInput = {
  apiSlug: string;
  origin: string;
  verificationCode: string;
};

export const generate = async (data: GenerateApiKeyInput) => {
  const response = await api.post(GENERATE_API_KEY_URL, data);
  return response.data;
};

export const useGenerate = () => {
  return useMutation({
    mutationFn: generate,
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

export const connect = async (data: ConnectApiKeyInput) => {
  const response = await api.post(CONNECT_API_KEY_URL, data);
  return response.data;
};

export const useConnect = () => {
  return useMutation({
    mutationFn: connect,
    onSuccess: () => {
      console.log("congrats you connected with an api key");
    },
    onError: (error) => {
      console.error("useConnect", error);
    },
  });
};
