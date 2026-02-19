import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

const VERIFICATION_CODES_KEY = "verificationCodes" as const;
const VERIFICATION_CODE_ENDPOINT = "/codes";
export const REQUEST_LOGIN_URL = "/codes/login";
export const REQUEST_PASSWORD_RESET_URL = "/codes/password-reset";
export const REQUEST_LOGOUT_ALL_URL = "/codes/logout-all";
export const REQUEST_DELETE_PROFILE_URL = "/codes/unregister";
export const REQUEST_CREATE_API_KEY_URL = "/codes/generate-key";

export const OTP_STATUS_KEY = "pendingOtp" as const;

export const OTP_STATUS_NONE = "NONE";
export const OTP_STATUS_LOGIN = "LOGIN";
export const OTP_STATUS_LOGOUT_ALL = "LOGOUT_ALL";
export const OTP_STATUS_PASSWORD_RESET = "PASSWORD_RESET";
export const OTP_STATUS_DELETE_PROFILE = "DELETE_PROFILE";
export const OTP_STATUS_CREATE_API_KEY = "CREATE_API_KEY";

export type OtpStatus =
  | typeof OTP_STATUS_NONE
  | typeof OTP_STATUS_LOGIN
  | typeof OTP_STATUS_LOGOUT_ALL
  | typeof OTP_STATUS_PASSWORD_RESET
  | typeof OTP_STATUS_DELETE_PROFILE
  | typeof OTP_STATUS_CREATE_API_KEY;

export type OtpInput = {
  email: string;
  verificationCode: string;
};

export const useOtpStatus = (): OtpStatus => {
  const query = useQuery({
    queryKey: [OTP_STATUS_KEY],
    queryFn: () => "NONE",
    enabled: false,
    initialData: "NONE",
  });
  return query.data as OtpStatus;
};

const getProfileVerificationCodes = async () => {
  const response = await api.get(VERIFICATION_CODE_ENDPOINT);
  return response.data;
};

export const useGetProfileVerificationCodes = () => {
  const query = useQuery({
    queryKey: [VERIFICATION_CODES_KEY],
    queryFn: getProfileVerificationCodes,
  });

  return query;
};
