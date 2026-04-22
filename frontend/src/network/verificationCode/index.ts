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
import {
  OTP_STATUS_CREATE_API_KEY,
  OTP_STATUS_DELETE_PROFILE,
  OTP_STATUS_DESTROY_API_KEY,
  OTP_STATUS_LOGIN,
  OTP_STATUS_LOGOUT_ALL,
  OTP_STATUS_PASSWORD_RESET,
  OtpStatus,
  RequestDeleteProfileInput,
  RequestDestroyApiKeyInput,
  RequestGenerateApiKeyInput,
  RequestLoginFormInput,
  RequestLogoutAllSessionsInput,
  RequestPasswordResetInput,
  RequestVerificationCodeInput,
} from "./types";

const VERIFICATION_CODES_KEY = "verificationCodes" as const;
export const OTP_STATUS_KEY = "pendingOtp" as const;

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

export * from "./types";
