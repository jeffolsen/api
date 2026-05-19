import { OtpInput, TVerificationCode } from "@/network/verificationCode/types";
import { TSession } from "../session";

export const PROFILE_KEY = "profile" as const;
export const PROFILE_INCLUDES = "sessions,verifcationCodes";

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

export type TProfileSession = {
  profileId: number;
  sessionId: number;
  session: TSession;
};

export type TProfileVerificationCode = {
  profileId: number;
  verificationCodeId: number;
  verificationCode: TVerificationCode;
};

export type TProfileWithIncludes = TProfile & {
  sessions: TProfileSession[];
  verificationCodes: TProfileVerificationCode[];
};
