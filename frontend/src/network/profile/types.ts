import { OtpInput } from "../verificationCode/types";

export type PasswordResetWithOTPFormInput = OtpInput & {
  password: string;
  confirmPassword: string;
};

export type DeleteProfileWithOTPFormInput = {
  verificationCode: string;
};

export type PasswordResetWithSessionFormInput = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type TProfile = {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
};
