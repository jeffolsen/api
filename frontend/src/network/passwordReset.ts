import {
  OTP_STATUS_NONE,
  OTP_STATUS_PASSWORD_RESET,
  OtpInput,
  useRequestOrSubmitOtp,
} from "./otp";
import { api } from "./api";

const REQUEST_PASSWORD_RESET_URL = "/codes/password-reset";

export type RequestPasswordResetInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const requestPasswordReset = async (data: RequestPasswordResetInput) => {
  const response = await api.post(REQUEST_PASSWORD_RESET_URL, data);
  return response.data;
};

export const useRequestPasswordReset = () => {
  return useRequestOrSubmitOtp({
    mutationFn: requestPasswordReset,
    status: OTP_STATUS_PASSWORD_RESET,
    onError: (error) => {
      console.error("useRequestPasswordReset", error);
    },
  });
};

const PASSWORD_RESET_WITH_OTP_URL = "/profile/password-reset";

export type PasswordResetWithOTPFormInput = OtpInput;

export const passwordResetWithOTP = async (
  data: PasswordResetWithOTPFormInput,
) => {
  const response = await api.post(PASSWORD_RESET_WITH_OTP_URL, data);
  return response.data;
};

export const usePasswordResetWithOTP = () => {
  return useRequestOrSubmitOtp({
    mutationFn: passwordResetWithOTP,
    status: OTP_STATUS_NONE,
    onError: (error) => {
      console.error("usePasswordResetWithOTP", error);
    },
  });
};
