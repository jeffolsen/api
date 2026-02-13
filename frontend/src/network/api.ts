import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api"
    : "website/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

export type FormData<T> = {
  [K in keyof T]: T[K];
};

export { axios };

export const getProfile = async () => {
  const response = await api.post("/profiles/me");
  return response.data;
};

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const register = async (data: RegisterFormInput) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export type LoginFormInput = {
  email: string;
  password: string;
};

export const login = async (data: LoginFormInput) => {
  const response = await api.post("/codes/login", data);
  return response.data;
};

export type PasswordResetInput = {
  email: string;
  password: string;
  confirmPassword: string;
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
