import { useAuthState } from "@/contexts/AuthContext";
import { REQUEST_PASSWORD_RESET_ENDPOINT } from "@/network/clients/api";
import { useRequestVerificationCode } from "./useRequestVerificationCode";
import { OTP_STATUS_PASSWORD_RESET, RequestPasswordResetInput } from "./types";

export const useRequestPasswordReset = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestPasswordResetInput) => {
      const response = await api.post(REQUEST_PASSWORD_RESET_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_PASSWORD_RESET,
  });
};
