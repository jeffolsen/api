export const OTP_STATUS_NONE = "NONE";
export const OTP_STATUS_LOGIN = "LOGIN";
export const OTP_STATUS_LOGOUT_ALL = "LOGOUT_ALL";
export const OTP_STATUS_PASSWORD_RESET = "PASSWORD_RESET";
export const OTP_STATUS_DELETE_PROFILE = "DELETE_PROFILE";
export const OTP_STATUS_CREATE_API_KEY = "CREATE_API_KEY";
export const OTP_STATUS_DESTROY_API_KEY = "DESTROY_API_KEY";

export type OtpStatus =
  | typeof OTP_STATUS_NONE
  | typeof OTP_STATUS_LOGIN
  | typeof OTP_STATUS_LOGOUT_ALL
  | typeof OTP_STATUS_PASSWORD_RESET
  | typeof OTP_STATUS_DELETE_PROFILE
  | typeof OTP_STATUS_CREATE_API_KEY
  | typeof OTP_STATUS_DESTROY_API_KEY;

export type OtpInput = {
  email: string;
  verificationCode: string;
};

export type RequestVerificationCodeInput<TData, TResponse> = {
  mutationFn: (data: TData) => Promise<TResponse>;
  status: OtpStatus;
};

export type RequestGenerateApiKeyInput = {
  email: string;
  password: string;
};

export type RequestLoginFormInput = {
  email: string;
  password: string;
};

export type RequestLogoutAllSessionsInput = {
  email: string;
  password: string;
};

export type RequestPasswordResetInput = {
  email: string;
};

export type RequestDeleteProfileInput = {
  email: string;
  password: string;
};

export type RequestDestroyApiKeyInput = {
  email: string;
  password: string;
};
