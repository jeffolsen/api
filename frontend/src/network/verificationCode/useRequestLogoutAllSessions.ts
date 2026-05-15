import { useAuthState } from "@/contexts/AuthContext";
import { REQUEST_LOGOUT_ALL_ENDPOINT } from "@/network/clients/api";
import { useRequestVerificationCode } from "./useRequestVerificationCode";
import { OTP_STATUS_LOGOUT_ALL, RequestLogoutAllSessionsInput } from "./types";

export const useRequestLogoutAllSessions = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestLogoutAllSessionsInput) => {
      const response = await api.post(REQUEST_LOGOUT_ALL_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_LOGOUT_ALL,
  });
};
