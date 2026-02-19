import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  OTP_STATUS_KEY,
  OTP_STATUS_NONE,
  OTP_STATUS_PASSWORD_RESET,
  OTP_STATUS_DELETE_PROFILE,
  REQUEST_PASSWORD_RESET_URL,
  OtpInput,
} from "./verificationCode";
import { api } from "./api";
import { useRefresh } from "./auth";

const PROFILE_URL = "/profiles/me";
const PASSWORD_RESET_WITH_OTP_URL = "/profile/password-reset";
const REQUEST_DELETE_PROFILE_URL = "/profile/unregister";

const PROFILE_KEY = "profile" as const;

export const getAuthenticatedProfile = async () => {
  const response = await api.get(PROFILE_URL);
  return response.data;
};

export const useGetAuthenticatedProfile = () => {
  const refresh = useRefresh();
  const query = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getAuthenticatedProfile,
  });

  if (query.error) {
    console.error("useGetAuthenticatedProfile", query.error);
    refresh.mutate();
  }

  return query;
};

export type RequestPasswordResetInput = {
  email: string;
};

export const requestPasswordReset = async (data: RequestPasswordResetInput) => {
  const response = await api.post(REQUEST_PASSWORD_RESET_URL, data);
  return response.data;
};

export const useRequestPasswordReset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_PASSWORD_RESET);
    },
    onError: (error) => {
      console.error("useRequestPasswordReset", error);
    },
  });
};

export type PasswordResetWithOTPFormInput = OtpInput & {
  password: string;
  confirmPassword: string;
};

export const passwordResetWithOTP = async (
  data: PasswordResetWithOTPFormInput,
) => {
  const response = await api.post(PASSWORD_RESET_WITH_OTP_URL, data);
  return response.data;
};

export const usePasswordResetWithOTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: passwordResetWithOTP,
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
    },
    onError: (error) => {
      console.error("usePasswordResetWithOTP", error);
    },
  });
};

export type RequestDeleteProfileInput = {
  email: string;
  password: string;
};

export const requestDeleteProfile = async (data: RequestDeleteProfileInput) => {
  const response = await api.post(REQUEST_DELETE_PROFILE_URL, data);
  return response.data;
};

export const useRequestDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestDeleteProfile,
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_DELETE_PROFILE);
    },
    onError: (error) => {
      console.error("useRequestDeleteProfile", error);
    },
  });
};

export type DeleteProfileWithOTPFormInput = OtpInput;

export const deleteProfileWithOTP = async (
  data: DeleteProfileWithOTPFormInput,
) => {
  const response = await api.post(REQUEST_DELETE_PROFILE_URL, data);
  return response.data;
};

export const useDeleteProfileWithOTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfileWithOTP,
    onSuccess: () => {
      queryClient.setQueryData([PROFILE_KEY], null);
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
    },
    onError: (error) => {
      console.error("useDeleteProfileWithOTP", error);
    },
  });
};
