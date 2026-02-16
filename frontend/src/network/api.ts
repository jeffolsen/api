import axios from "axios";
import { useCookies } from "react-cookie";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api"
    : "website/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

interface CookieValues {
  authenticated?: "true";
}

export const useIsLoggedIn = () => {
  const [cookies] = useCookies<"authenticated", CookieValues>([
    "authenticated",
  ]);
  return () => cookies.authenticated === "true";
};

export const useLogin = () => {
  const [, setCookie] = useCookies<"authenticated", CookieValues>([
    "authenticated",
  ]);
  return () => setCookie("authenticated", "true");
};

export const useLogout = () => {
  const [, , removeCookie] = useCookies<"authenticated", CookieValues>([
    "authenticated",
  ]);
  return () => removeCookie("authenticated");
};

const verificationCodePaths = {
  LOGIN: "/codes/login",
  LOGOUT_ALL: "/codes/logout-all",
  PASSWORD_RESET: "/codes/password-reset",
  DELETE_PROFILE: "/codes/delete-profile",
  CREATE_API_KEY: "/codes/generate-key",
} as const;

export type CodeType = keyof typeof verificationCodePaths;

export type VerificationCodeFormInput = {
  code: string;
  codeType: CodeType;
};

export const submitOTP = async (data: VerificationCodeFormInput) => {
  const { codeType, ...d } = data;
  const response = await api.post(verificationCodePaths[codeType], d);
  return response.data;
};
