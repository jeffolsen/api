import { useMutation } from "@tanstack/react-query";
import { api } from "./api";

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

const REGISTER_URL = "/auth/register";

export const register = async (data: RegisterFormInput) => {
  const response = await api.post(REGISTER_URL, data);
  return response.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      console.log("congrats you registered");
    },
    onError: (error) => {
      console.error("useRegister", error);
    },
  });
};
