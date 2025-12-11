import { SignOptions } from "jsonwebtoken";

// routes
export const AUTH_ROUTES = "/api/auth";
export const AUTH_REGISTER_ENDPOINT = "/register";
export const AUTH_LOGIN_ENDPOINT = "/login";
export const AUTH_LOGOUT_ALL_ENDPOINT = "/logout-all";
export const AUTH_PASSWORD_RESET_ENDPOINT = "/password-reset";
export const AUTH_DELETE_PROFILE_ENDPOINT = "/delete-profile";
export const PROFILE_ROUTES = "/api/profiles";
export const PROFILE_SELF_ENDPOINT = "/me";
export const SESSION_ROUTES = "/api/sessions";
export const SESSION_REFRESH_ENDPOINT = "/refresh";
export const SESSION_LOGOUT_ENDPOINT = "/logout";
export const VERIFICATION_CODE_ROUTES = "/api/verify";
export const VERIFICATION_CODE_LOGIN_ENDPOINT = "/login";
export const VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT = "/logout-all";
export const VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT = "/password-reset";
export const VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT = "/delete-profile";

// scopes
export const READ_PROFILE_SCOPE = "read:profile";
export const UPDATE_PROFILE_SCOPE = "update:profile";
export const READ_VERIFICATION_CODE_SCOPE = "read:verificationCode";
export const READ_SESSION_SCOPE = "read:session";
export const UPDATE_SESSION_SCOPE = "update:session";
// auth scopes
export const LOGIN_SCOPE = "auth:login";
export const LOGOUT_ALL_SCOPE = "auth:logout-all";
export const PASSWORD_RESET_SCOPE = "auth:update-password";
export const DELETE_PROFILE_SCOPE = "auth:delete-profile";

// http codes
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

// resource limits
export const MAX_SYSTEM_EMAILS = 90;
export const MAX_PROFILE_SESSIONS = 5;
export const MAX_PROFILE_CODES = 4;

// 4 days in ms
export const SESSION_TOKEN_LIFESPAN = 4 * 24 * 60 * 60 * 1000;
export const SESSION_TOKEN_OPTIONS = {
  expiresIn: SESSION_TOKEN_LIFESPAN,
} as SignOptions;
// 15 minutes in ms
export const ACCESS_TOKEN_LIFESPAN = 15 * 60 * 1000;
export const ACCESS_TOKEN_OPTIONS = {
  expiresIn: ACCESS_TOKEN_LIFESPAN,
} as SignOptions;
// 8 hours in ms
export const VERIFICATION_CODE_LIFESPAN = 8 * 60 * 60 * 1000;
