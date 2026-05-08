import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PROFILE_ENDPOINT, withErrorHandling, useEmail } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { OTP_STATUS_KEY, OTP_STATUS_NONE } from "@/network/verificationCode/types";
import { PROFILE_KEY, DeleteProfileWithOTPFormInput } from "./types";

export const useDeleteProfileWithOTP = () => {
  const { api, setIsAuthenticated } = useAuthState();
  const { setEmail } = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteProfileWithOTPFormInput) =>
      withErrorHandling(async () => {
        const { verificationCode } = data;
        const headers = {
          "X-Verification-Code": verificationCode,
        };
        const response = await api.delete(PROFILE_ENDPOINT, { headers });
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([PROFILE_KEY], null);
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      setEmail("");
      setIsAuthenticated(false);
    },
  });
};
