import { useQuery } from "@tanstack/react-query";
import { OTP_STATUS_KEY, OtpStatus } from "./types";

export const useOtpStatus = (): OtpStatus => {
  const query = useQuery({
    queryKey: [OTP_STATUS_KEY],
    queryFn: () => "NONE",
    enabled: false,
    initialData: "NONE",
  });
  return query.data as OtpStatus;
};
