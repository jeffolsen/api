import { OTP_STATUS_KEY, OTP_STATUS_NONE, OtpInput } from "./verificationCode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REGISTER_ENDPOINT, LOGIN_WITH_OTP_ENDPOINT } from "./api";
import { useAuthState } from "../contexts/AuthContext";

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const useRegister = () => {
  const { api } = useAuthState();

  return useMutation({
    mutationFn: async (data: RegisterFormInput) => {
      const response = await api.post(REGISTER_ENDPOINT, data);
      return response.data;
    },
    onSuccess: () => {
      console.log("congrats you registered");
    },
    onError: (error) => {
      console.error("useRegister", error);
    },
  });
};

export type LoginWithOTPFormInput = OtpInput;

export const useLoginWithOTP = () => {
  const queryClient = useQueryClient();
  const { api, setIsAuthenticated } = useAuthState();

  return useMutation({
    mutationFn: async (data: LoginWithOTPFormInput) => {
      const response = await api.post(LOGIN_WITH_OTP_ENDPOINT, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      setIsAuthenticated(true);
    },
    onError: (error) => {
      console.error("useLoginWithOTP", error);
      setIsAuthenticated(false);
    },
  });
};
