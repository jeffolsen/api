import axios, { isAxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import jsCookie from "js-cookie";
import { EMAIL_DEFAULT } from "../config/inputs";

// these should match the backend routes, may need website url in front of them in production
const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE_URL + "/api"
    : "/api";

export const REFRESH_ENDPOINT = "/auth/refresh";
export const REGISTER_ENDPOINT = "/auth/register";
export const LOGIN_WITH_OTP_ENDPOINT = "/auth/login";

export const PROFILE_ENDPOINT = "/profiles/me";
export const PASSWORD_RESET_WITH_OTP_ENDPOINT = "/profiles/password-reset";
export const PASSWORD_CHANGE_ENDPOINT = "/profiles/password-change";

export const SESSIONS_ENDPOINT = "/sessions";
export const LOGOUT_ENDPOINT = SESSIONS_ENDPOINT + "/logout";
export const SESSIONS_RESET_WITH_OTP_ENDPOINT = SESSIONS_ENDPOINT + "/reset";
export const LOGOUT_ALL_ENDPOINT = SESSIONS_ENDPOINT + "/logout-all";

export const VERIFICATION_CODE_ENDPOINT = "/codes";
export const REQUEST_LOGIN_ENDPOINT = "/codes/login";
export const REQUEST_PASSWORD_RESET_ENDPOINT = "/codes/password-reset";
export const REQUEST_LOGOUT_ALL_ENDPOINT = "/codes/sessions-reset";
export const REQUEST_DELETE_PROFILE_ENDPOINT = "/codes/unregister";
export const REQUEST_MANAGE_API_KEY_ENDPOINT = "/codes/manage-api-key";

export const GET_PROFILES_API_KEYS_ENDPOINT = "/keys";
export const GENERATE_API_KEY_ENDPOINT = "/keys/generate";
export const CONNECT_API_KEY_ENDPOINT = "/keys/public";
export const DESTROY_API_KEY_ENDPOINT = "/keys/destroy";

export const IMAGES_ENDPOINT = "/images";
export const ITEMS_ENDPOINT = "/items";
export const TAGS_ENDPOINT = "/tags";

export const OK = 200;
export const CREATED = 201;
export const NO_CONTENT = 204;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const UNPROCESSABLE_CONTENT = 422;
export const TOO_MANY_REQUESTS = 429;
export const INTERNAL_SERVER_ERROR = 500;

export const EMAIL_KEY = "email" as const;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const isAuthenticated = () => {
  return jsCookie.get("authenticated") === "true";
};

export const fetcher = (
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: Record<string, unknown>,
): Promise<unknown> =>
  fetch(BASE_URL + path, { method, body: JSON.stringify(data) });

export const setIsAuthenticated = (value: boolean) => {
  if (value) {
    jsCookie.set("authenticated", "true");
  } else {
    jsCookie.remove("authenticated");
  }
};

export const handleAxiosErrorForMutation = async (
  mutationFn: (data: unknown) => unknown,
  data: unknown,
) => {
  try {
    return mutationFn(data);
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(JSON.stringify(error.response?.data));
    }
    throw error;
  }
};

export const transformAxiosError = (error: unknown): never => {
  if (isAxiosError(error)) {
    throw new Error(JSON.stringify(error.response?.data), {
      cause: error.response?.status,
    });
  }
  throw error;
};

export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => void,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    onError?.(error);
    return transformAxiosError(error);
  }
};

export const withFormHandling = async <T>(
  fn: () => Promise<T>,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  },
): Promise<void> => {
  try {
    await fn();
    options?.onSuccess?.();
  } catch (error) {
    if (options?.onError) {
      options.onError(error as Error);
    } else {
      throw error;
    }
  }
};

export const useEmail = () => {
  const queryClient = useQueryClient();
  useQuery({
    queryKey: [EMAIL_KEY],
    queryFn: () => "NONE",
    enabled: false,
    initialData: "NONE",
  });

  return {
    setEmail: (email: string = "NONE") => {
      queryClient.setQueryData([EMAIL_KEY], email);
    },
    getEmail: () => {
      const email = queryClient.getQueryData([EMAIL_KEY]) as string | undefined;
      return !email
        ? EMAIL_DEFAULT
        : email === "NONE"
          ? EMAIL_DEFAULT
          : { email };
    },
  };
};

export default api;
