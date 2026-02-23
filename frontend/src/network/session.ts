import { useMutation, useQuery } from "@tanstack/react-query";
import { SESSIONS_ENDPOINT, LOGOUT_ENDPOINT, withErrorHandling } from "./api";
import { useAuthState } from "../contexts/AuthContext";

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

interface LogoutAllInput {
  verificationCode: string;
  email: string;
}

export const useLogoutAll = () => {
  const { api, setIsAuthenticated } = useAuthState();

  return useMutation({
    mutationFn: async (data: LogoutAllInput) =>
      withErrorHandling(async () => {
        const response = await api.post(LOGOUT_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      setIsAuthenticated(false);
      console.log("congrats you logged out of all sessions");
    },
  });
};
