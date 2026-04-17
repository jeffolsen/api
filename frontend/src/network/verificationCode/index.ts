import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  VERIFICATION_CODE_ENDPOINT,
  REQUEST_LOGIN_ENDPOINT,
  REQUEST_LOGOUT_ALL_ENDPOINT,
  REQUEST_PASSWORD_RESET_ENDPOINT,
  REQUEST_DELETE_PROFILE_ENDPOINT,
  REQUEST_MANAGE_API_KEY_ENDPOINT,
  withErrorHandling,
} from "../api";
import { useAuthState } from "../../contexts/AuthContext";

const VERIFICATION_CODES_KEY = "verificationCodes" as const;
export const OTP_STATUS_KEY = "pendingOtp" as const;

export const OTP_STATUS_NONE = "NONE";
export const OTP_STATUS_LOGIN = "LOGIN";
export const OTP_STATUS_LOGOUT_ALL = "LOGOUT_ALL";
export const OTP_STATUS_PASSWORD_RESET = "PASSWORD_RESET";
export const OTP_STATUS_DELETE_PROFILE = "DELETE_PROFILE";
export const OTP_STATUS_CREATE_API_KEY = "CREATE_API_KEY";
export const OTP_STATUS_DESTROY_API_KEY = "DESTROY_API_KEY";

export type OtpStatus =
  | typeof OTP_STATUS_NONE
  | typeof OTP_STATUS_LOGIN
  | typeof OTP_STATUS_LOGOUT_ALL
  | typeof OTP_STATUS_PASSWORD_RESET
  | typeof OTP_STATUS_DELETE_PROFILE
  | typeof OTP_STATUS_CREATE_API_KEY
  | typeof OTP_STATUS_DESTROY_API_KEY;

export type OtpInput = {
  email: string;
  verificationCode: string;
};

export const useOtpStatus = (): OtpStatus => {
  const query = useQuery({
    queryKey: [OTP_STATUS_KEY],
    queryFn: () => "NONE",
    enabled: false,
    initialData: "NONE",
  });
  return query.data as OtpStatus;
};

export const useGetProfileVerificationCodes = () => {
  const { api } = useAuthState();

  const query = useQuery({
    queryKey: [VERIFICATION_CODES_KEY],
    queryFn: async () => {
      const response = await api.get(VERIFICATION_CODE_ENDPOINT);
      return response.data;
    },
  });

  return query;
};

type RequestVerificationCodeInput<TData, TResponse> = {
  mutationFn: (data: TData) => Promise<TResponse>;
  status: OtpStatus;
};

const useRequestVerificationCode = <TData, TResponse = unknown>({
  mutationFn,
  status,
}: RequestVerificationCodeInput<TData, TResponse>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TData) => withErrorHandling(() => mutationFn(data)),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], status);
      queryClient.invalidateQueries({ queryKey: [VERIFICATION_CODES_KEY] });
    },
  });
};

export type RequestLoginFormInput = {
  email: string;
  password: string;
};

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

export type RequestLogoutAllSessionsInput = {
  email: string;
  password: string;
};

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

export type RequestPasswordResetInput = {
  email: string;
};

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

export type RequestDeleteProfileInput = {
  email: string;
  password: string;
};

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

export type RequestGenerateApiKeyInput = {
  email: string;
  password: string;
};

export const useRequestGenerateApiKey = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestGenerateApiKeyInput) => {
      const response = await api.post(REQUEST_MANAGE_API_KEY_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_CREATE_API_KEY,
  });
};

export type RequestDestroyApiKeyInput = {
  email: string;
  password: string;
};

export const useRequestDestroyApiKey = () => {
  const { api } = useAuthState();
  return useRequestVerificationCode({
    mutationFn: async (data: RequestDestroyApiKeyInput) => {
      const response = await api.post(REQUEST_MANAGE_API_KEY_ENDPOINT, data);
      return response.data;
    },
    status: OTP_STATUS_DESTROY_API_KEY,
  });
};
