import {
  OTP_STATUS_KEY,
  OTP_STATUS_LOGIN,
  OTP_STATUS_NONE,
  REQUEST_LOGIN_URL,
  OtpInput,
} from "./verificationCode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, useLogin, useLogout } from "./api";

const REGISTER_URL = "/auth/register";
const LOGIN_WITH_OTP_URL = "/auth/login";
const REFRESH_URL = "/auth/refresh";

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

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

export type RequestLoginFormInput = {
  email: string;
  password: string;
};

export const requestLogin = async (data: RequestLoginFormInput) => {
  const response = await api.post(REQUEST_LOGIN_URL, data);
  return response.data;
};

export const useRequestLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestLogin,
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_LOGIN);
    },
    onError: (error) => {
      console.error("useRequestLogin", error);
    },
  });
};

export type LoginWithOTPFormInput = OtpInput;

export const loginWithOTP = async (data: LoginWithOTPFormInput) => {
  const response = await api.post(LOGIN_WITH_OTP_URL, data);
  return response.data;
};

export const useLoginWithOTP = () => {
  const login = useLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginWithOTP,
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], OTP_STATUS_NONE);
      login();
    },
    onError: (error) => {
      console.error("useLoginWithOTP", error);
    },
  });
};

export const refresh = async () => {
  const response = await api.post(REFRESH_URL);
  return response.data;
};

export const useRefresh = () => {
  const login = useLogin();
  const logout = useLogout();
  return useMutation({
    mutationFn: refresh,
    onSuccess: () => {
      login();
    },
    onError: (error) => {
      console.error("useRefresh", error);
      logout();
    },
  });
};
