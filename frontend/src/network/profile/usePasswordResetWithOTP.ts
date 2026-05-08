import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PASSWORD_RESET_WITH_OTP_ENDPOINT,
  withErrorHandling,
} from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { OTP_STATUS_KEY, OTP_STATUS_NONE } from "@/network/verificationCode/types";
import { PasswordResetWithOTPFormInput } from "./types";

export const usePasswordResetWithOTP = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PasswordResetWithOTPFormInput) =>
      withErrorHandling(async () => {
        const { verificationCode, ...restData } = data;
        const headers = {
          "X-Verification-Code": verificationCode,
        };
        const response = await api.post(
          PASSWORD_RESET_WITH_OTP_ENDPOINT,
          restData,
          { headers },
        );
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
    },
  });
};
