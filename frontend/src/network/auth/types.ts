import { OtpInput } from "@/network/verificationCode/types";

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
  assertEighteenYearsOrOlder: boolean;
  consentToPrivacy: boolean;
  consentToTerms: boolean;
};

export type LoginWithOTPFormInput = OtpInput;
