import { OtpInput } from "@/network/verificationCode/types";

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginWithOTPFormInput = OtpInput;
