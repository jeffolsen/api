import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  SESSIONS_ENDPOINT,
  LOGOUT_ENDPOINT,
  LOGOUT_ALL_ENDPOINT,
  SESSIONS_RESET_WITH_OTP_ENDPOINT,
  withErrorHandling,
  useEmail,
} from "../api";
import { useAuthState } from "../../contexts/AuthContext";
import { OTP_STATUS_KEY } from "../verificationCode";
import { OTP_STATUS_NONE } from "../verificationCode/types";

const SESSION_KEY = "sessions" as const;

export const useGetProfilesSessions = () => {
  const { api } = useAuthState();

  const query = useQuery({
    queryKey: [SESSION_KEY],
    queryFn: async () => {
      const response = await api.get(SESSIONS_ENDPOINT);
      return response.data;
    },
  });

  return query;
};

export const useLogout = () => {
  const { api, setIsAuthenticated } = useAuthState();
  const { setEmail } = useEmail();

  return useMutation({
    mutationFn: async () =>
      withErrorHandling(async () => {
        const response = await api.post(LOGOUT_ENDPOINT);
        return response.data;
      }),
    onSuccess: () => {
      setEmail("");
      setIsAuthenticated(false);
    },
  });
};

export type LogoutAllWithSessionFormInput = {
  password: string;
};

export const useLogoutAllWithSession = () => {
  const { api, setIsAuthenticated } = useAuthState();
  const { setEmail } = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogoutAllWithSessionFormInput) =>
      withErrorHandling(async () => {
        const response = await api.post(LOGOUT_ALL_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      setEmail("");
      setIsAuthenticated(false);
    },
  });
};

export type ResetSessionsWithOTPFormInput = {
  email: string;
  verificationCode: string;
};

export const useResetSessionsWithOTP = () => {
  const { api, setIsAuthenticated } = useAuthState();
  const { setEmail } = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResetSessionsWithOTPFormInput) =>
      withErrorHandling(async () => {
        const { verificationCode, ...restData } = data;
        const headers = {
          "X-Verification-Code": verificationCode,
        };
        const response = await api.post(
          SESSIONS_RESET_WITH_OTP_ENDPOINT,
          restData,
          {
            headers,
          },
        );
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      setEmail("");
      setIsAuthenticated(false);
    },
  });
};

export * from "./types";
