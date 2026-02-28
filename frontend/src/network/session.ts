import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  SESSIONS_ENDPOINT,
  LOGOUT_ENDPOINT,
  LOGOUT_ALL_ENDPOINT,
  withErrorHandling,
} from "./api";
import { useAuthState } from "../contexts/AuthContext";
import { OTP_STATUS_KEY, OTP_STATUS_NONE, OtpInput } from "./verificationCode";

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

  return useMutation({
    mutationFn: async () =>
      withErrorHandling(async () => {
        const response = await api.post(LOGOUT_ENDPOINT);
        return response.data;
      }),
    onSuccess: () => {
      setIsAuthenticated(false);
      console.log("congrats you logged out");
    },
  });
};

export type LogoutAllWithOTPFormInput = OtpInput;

export const useLogoutAllWithOTP = () => {
  const { api, setIsAuthenticated } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogoutAllWithOTPFormInput) =>
      withErrorHandling(async () => {
        const response = await api.post(LOGOUT_ALL_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      setIsAuthenticated(false);
    },
  });
};
