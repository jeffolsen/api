import axios from "axios";
import { useCookies } from "react-cookie";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api"
    : "website/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface CookieValues {
  authenticated?: "true";
}

export const useIsLoggedIn = () => {
  const [cookies] = useCookies<"authenticated", CookieValues>([
    "authenticated",
  ]);
  return cookies.authenticated;
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
