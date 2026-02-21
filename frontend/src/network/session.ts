import { useQuery } from "@tanstack/react-query";
import { SESSIONS_ENDPOINT } from "./api";
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

export const logout = async () => {};

interface LogoutAllInput {
  verificationCode: string;
  email: string;
}

export const logoutAll = async (input: LogoutAllInput) => {
  return input;
};
