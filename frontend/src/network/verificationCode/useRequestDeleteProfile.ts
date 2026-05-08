import { useAuthState } from "@/contexts/AuthContext";
import { REQUEST_DELETE_PROFILE_ENDPOINT } from "@/network/api";
import { useRequestVerificationCode } from "./useRequestVerificationCode";
import { OTP_STATUS_DELETE_PROFILE, RequestDeleteProfileInput } from "./types";

export const useRequestDeleteProfile = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestDeleteProfileInput) => {
      const response = await api.post(REQUEST_DELETE_PROFILE_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_DELETE_PROFILE,
  });
};
