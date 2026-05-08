import { useAuthState } from "@/contexts/AuthContext";
import { REQUEST_LOGIN_ENDPOINT } from "@/network/api";
import { useRequestVerificationCode } from "./useRequestVerificationCode";
import { OTP_STATUS_LOGIN, RequestLoginFormInput } from "./types";

export const useRequestLogin = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestLoginFormInput) => {
      const response = await api.post(REQUEST_LOGIN_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_LOGIN,
  });
};
