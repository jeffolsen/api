import { useMutation } from "@tanstack/react-query";
import { PASSWORD_CHANGE_ENDPOINT, withErrorHandling } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { PasswordResetWithSessionFormInput } from "./types";

export const usePasswordResetWithSession = () => {
  const { api } = useAuthState();

  return useMutation({
    mutationFn: async (data: PasswordResetWithSessionFormInput) =>
      withErrorHandling(async () => {
        const response = await api.post(PASSWORD_CHANGE_ENDPOINT, data);
        return response.data;
      }),
  });
};
