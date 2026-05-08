import { useAuthState } from "@/contexts/AuthContext";
import { REQUEST_MANAGE_API_KEY_ENDPOINT } from "@/network/api";
import { useRequestVerificationCode } from "./useRequestVerificationCode";
import { OTP_STATUS_DESTROY_API_KEY, RequestDestroyApiKeyInput } from "./types";

export const useRequestDestroyApiKey = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestDestroyApiKeyInput) => {
      const response = await api.post(REQUEST_MANAGE_API_KEY_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_DESTROY_API_KEY,
  });
};
