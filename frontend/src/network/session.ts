import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "./api";

const SESSIONS_URL = "/sessions";
const SESSION_KEY = "sessions" as const;

export const getProfilesSessions = async () => {
  const response = await api.get(SESSIONS_URL);
  return response.data;
};

export const useGetProfilesSessions = () => {
  const query = useQuery({
    queryKey: [SESSION_KEY],
    queryFn: getProfilesSessions,
  });

  return query;
};

export const logout = async () => {};

interface LogoutAllInput {
  verificationCode: string;
  email: string;
}

export const logoutAll = async (input: LogoutAllInput) => {};
