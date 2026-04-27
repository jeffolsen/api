import { OTP_STATUS_KEY } from "@/network/verificationCode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  REGISTER_ENDPOINT,
  LOGIN_WITH_OTP_ENDPOINT,
  withErrorHandling,
} from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { LoginWithOTPFormInput, RegisterFormInput } from "@/network/auth/types";
import { OTP_STATUS_NONE } from "@/network/verificationCode/types";

export const useRegister = () => {
  const { api } = useAuthState();

  return useMutation({
    mutationFn: async (data: RegisterFormInput) =>
      withErrorHandling(async () => {
        const response = await api.post(REGISTER_ENDPOINT, data);
        return response.data;
      }),
  });
};

export const useLoginWithOTP = () => {
  const queryClient = useQueryClient();
  const { api, setIsAuthenticated } = useAuthState();

  return useMutation({
    mutationFn: (data: LoginWithOTPFormInput) =>
      withErrorHandling(
        async () => {
          const { verificationCode, ...restData } = data;
          const headers = {
            "X-Verification-Code": verificationCode,
          };
          const response = await api.post(LOGIN_WITH_OTP_ENDPOINT, restData, {
            headers,
          });
          return response.data;
        },
        () => setIsAuthenticated(false),
      ),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      setIsAuthenticated(true);
    },
  });
};

export * from "@/network/auth/types";
