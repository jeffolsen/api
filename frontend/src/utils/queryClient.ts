import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { AsyncStorage } from "@tanstack/react-query-persist-client";
import { isAxiosError } from "axios";
import { RateLimitError, UnauthorizedError } from "@/utils/errors";

const shouldRetry = (failureCount: number, error: unknown) => {
  if (error instanceof UnauthorizedError) return failureCount < 3;
  if (isAxiosError(error) && error.response && error.response.status === 401)
    return failureCount < 3;
  if (
    error instanceof Error &&
    typeof error.cause === "number" &&
    error.cause === 401
  )
    return failureCount < 3;

  if (error instanceof RateLimitError) return false;
  if (isAxiosError(error) && error.response && error.response.status < 500)
    return false;
  if (
    error instanceof Error &&
    typeof error.cause === "number" &&
    error.cause < 500
  )
    return false;
  return failureCount < 3;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: shouldRetry,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: window.localStorage as unknown as AsyncStorage,
});

export default queryClient;
