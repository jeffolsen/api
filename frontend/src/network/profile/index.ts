import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { OTP_STATUS_KEY } from "@/network/verificationCode";
import {
  PROFILE_ENDPOINT,
  PASSWORD_RESET_WITH_OTP_ENDPOINT,
  PASSWORD_CHANGE_ENDPOINT,
  withErrorHandling,
  useEmail,
} from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import {
  DeleteProfileWithOTPFormInput,
  PasswordResetWithOTPFormInput,
  PasswordResetWithSessionFormInput,
} from "@/network/profile/types";
import { OTP_STATUS_NONE } from "@/network/verificationCode/types";

const PROFILE_KEY = "profile" as const;

export const useGetAuthenticatedProfile = () => {
  const { api } = useAuthState();

  const query = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: async () => {
      const response = await api.get(PROFILE_ENDPOINT);
      return response.data;
    },
  });

  return query;
};

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
          {
            headers,
          },
        );
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
    },
  });
};

export const usePasswordResetWithSession = () => {
  const { api } = useAuthState();

  return useMutation({
    mutationFn: async (data: PasswordResetWithSessionFormInput) =>
      withErrorHandling(async () => {
        const response = await api.post(PASSWORD_CHANGE_ENDPOINT, data);
        return response.data;
      }),
  });
};

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

export * from "@/network/profile/types";
