import {
  OTP_STATUS_LOGIN,
  OTP_STATUS_NONE,
  OtpInput,
  useRequestOrSubmitOtp,
} from "./otp";
import { api, useLogin } from "./api";

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
  return useRequestOrSubmitOtp({
    mutationFn: requestLogin,
    status: OTP_STATUS_LOGIN,
    onError: (error) => {
      console.error("useLoginWithOTP", error);
    },
  });
};

const LOGIN_WITH_OTP_URL = "/auth/login";

export type LoginWithOTPFormInput = OtpInput;

export const loginWithOTP = async (data: LoginWithOTPFormInput) => {
  const response = await api.post(LOGIN_WITH_OTP_URL, data);
  return response.data;
};

export const useLoginWithOTP = () => {
  const login = useLogin();
  return useRequestOrSubmitOtp({
    mutationFn: loginWithOTP,
    status: OTP_STATUS_NONE,
    onSuccess: () => {
      login();
    },
    onError: (error) => {
      console.error("useLoginWithOTP", error);
    },
  });
};
