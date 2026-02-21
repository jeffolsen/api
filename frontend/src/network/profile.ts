import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { OTP_STATUS_KEY, OTP_STATUS_NONE, OtpInput } from "./verificationCode";
import {
  PROFILE_ENDPOINT,
  PASSWORD_RESET_WITH_OTP_ENDPOINT,
  REQUEST_DELETE_PROFILE_ENDPOINT,
} from "./api";
import { useAuthState } from "../contexts/AuthContext";

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

export type PasswordResetWithOTPFormInput = OtpInput & {
  password: string;
  confirmPassword: string;
};

export const usePasswordResetWithOTP = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PasswordResetWithOTPFormInput) => {
      const response = await api.post(PASSWORD_RESET_WITH_OTP_ENDPOINT, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
    },
    onError: (error) => {
      console.error("usePasswordResetWithOTP", error);
    },
  });
};

export type DeleteProfileWithOTPFormInput = OtpInput;

export const useDeleteProfileWithOTP = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteProfileWithOTPFormInput) => {
      const response = await api.post(REQUEST_DELETE_PROFILE_ENDPOINT, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData([PROFILE_KEY], null);
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
    },
    onError: (error) => {
      console.error("useDeleteProfileWithOTP", error);
    },
  });
};
