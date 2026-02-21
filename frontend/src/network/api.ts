import axios from "axios";
import jsCookie from "js-cookie";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api"
    : "website/api";

export const REFRESH_ENDPOINT = "/auth/refresh";
export const REGISTER_ENDPOINT = "/auth/register";
export const LOGIN_WITH_OTP_ENDPOINT = "/auth/login";

export const PROFILE_ENDPOINT = "/profiles/me";
export const PASSWORD_RESET_WITH_OTP_ENDPOINT = "/profile/password-reset";

export const SESSIONS_ENDPOINT = "/sessions";
export const LOGOUT_ENDPOINT = "/sessions/logout";
export const LOGOUT_ALL_ENDPOINT = "/sessions/logout-all";

export const VERIFICATION_CODE_ENDPOINT = "/codes";
export const REQUEST_LOGIN_ENDPOINT = "/codes/login";
export const REQUEST_PASSWORD_RESET_ENDPOINT = "/codes/password-reset";
export const REQUEST_LOGOUT_ALL_ENDPOINT = "/codes/logout-all";
export const REQUEST_DELETE_PROFILE_ENDPOINT = "/codes/unregister";
export const REQUEST_CREATE_API_KEY_ENDPOINT = "/codes/generate-key";

export const GET_PROFILES_API_KEYS_ENDPOINT = "/keys";
export const GENERATE_API_KEY_ENDPOINT = "/keys/generate";
export const CONNECT_API_KEY_ENDPOINT = "/keys/public";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const isAuthenticated = () => {
  return jsCookie.get("authenticated") === "true";
};

export const setIsAuthenticated = (value: boolean) => {
  if (value) {
    jsCookie.set("authenticated", "true");
  } else {
    jsCookie.remove("authenticated");
  }
};

export default api;
