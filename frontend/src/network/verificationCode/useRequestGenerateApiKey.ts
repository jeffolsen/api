import { useAuthState } from "@/contexts/AuthContext";
import { REQUEST_MANAGE_API_KEY_ENDPOINT } from "@/network/api";
import { useRequestVerificationCode } from "./useRequestVerificationCode";
import { OTP_STATUS_CREATE_API_KEY, RequestGenerateApiKeyInput } from "./types";

export const useRequestGenerateApiKey = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestGenerateApiKeyInput) => {
      const response = await api.post(REQUEST_MANAGE_API_KEY_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_CREATE_API_KEY,
  });
};
