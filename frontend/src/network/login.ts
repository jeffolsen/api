import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  OTP_STATUS_KEY,
  OTP_STATUS_LOGIN,
  OtpInput,
  useRequestOtp,
} from "./otp";
import { api } from "./api";

const REQUEST_LOGIN_URL = "/codes/login";

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

const LOGIN_WITH_OTP_URL = "/auth/login";

export type LoginWithOTPFormInput = OtpInput;

export const loginWithOTP = async (data: LoginWithOTPFormInput) => {
  console.log("loginWithOTP", data);
  const response = await api.post(LOGIN_WITH_OTP_URL, data);
  return response.data;
};

export const useLoginWithOTP = () => {
  return useRequestOtp<LoginWithOTPFormInput>(
    loginWithOTP,
    OTP_STATUS_LOGIN,
    (error) => {
      console.error("useLoginWithOTP", error);
    },
  );
};
