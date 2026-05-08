import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withErrorHandling } from "@/network/api";
import {
  OTP_STATUS_KEY,
  VERIFICATION_CODES_KEY,
  RequestVerificationCodeInput,
} from "./types";

export const useRequestVerificationCode = <TData, TResponse = unknown>({
  mutationFn,
  status,
}: RequestVerificationCodeInput<TData, TResponse>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TData) => withErrorHandling(() => mutationFn(data)),
    onSuccess: () => {
      queryClient.setQueryData([OTP_STATUS_KEY], status);
      queryClient.invalidateQueries({ queryKey: [VERIFICATION_CODES_KEY] });
    },
  });
};
