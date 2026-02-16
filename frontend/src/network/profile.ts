import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

const PROFILE_KEY = "profile" as const;
const PROFILE_URL = "/profiles/me";

export const getProfile = async () => {
  const response = await api.post(PROFILE_URL);
  return response.data;
};

export const useProfile = () => {
  return useQuery({ queryKey: [PROFILE_KEY], queryFn: getProfile });
};
