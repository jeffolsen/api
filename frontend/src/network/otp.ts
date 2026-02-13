import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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

export const useRequestOtp = <T>(
  mutationFn: (data: T) => Promise<unknown>,
  status: OtpStatus,
  onError?: (error: unknown) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], status);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
