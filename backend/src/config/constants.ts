import { SignOptions } from "jsonwebtoken";

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

// scopes
export const READ_PROFILE_SCOPE = "read:profile";
export const UPDATE_PROFILE_SCOPE = "update:profile";
export const DELETE_PROFILE_SCOPE = "delete:profile";
export const READ_SESSION_SCOPE = "read:session";
export const UPDATE_SESSION_SCOPE = "update:session";
export const DELETE_SESSION_SCOPE = "delete:session";
export const UPDATE_EMAIL_SCOPE = "update:email";
export const UPDATE_PASSWORD_SCOPE = "update:password";
export const READ_VERIFICATION_CODE_SCOPE = "read:verificationCode";

// resource limits
export const MAX_LOGIN_FAILURES = 4;
export const MAX_PROFILE_SESSIONS = 3;
export const MAX_PROFILE_CODES = 4;

// two days in ms
export const SESSION_TOKEN_LIFESPAN = 48 * 60 * 60 * 1000;
export const SESSION_TOKEN_OPTIONS = {
  expiresIn: SESSION_TOKEN_LIFESPAN,
} as SignOptions;
// 10 minutes in ms
export const ACCESS_TOKEN_LIFESPAN = 10 * 60 * 1000;
export const ACCESS_TOKEN_OPTIONS = {
  expiresIn: ACCESS_TOKEN_LIFESPAN,
} as SignOptions;
// 8 hours in ms
export const VERIFICATION_CODE_LIFESPAN = 8 * 60 * 60 * 1000;
