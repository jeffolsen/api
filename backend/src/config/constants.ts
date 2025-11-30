import { SignOptions } from "jsonwebtoken";

// http codes
export const OK = 200;
export const CREATED = 201;
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
export const DELETE_SESSION_SCOPE = "delete:session";

// resource limits
export const MAX_PROFILE_SESSIONS = 3;
export const MAX_PROFILE_CODES = 5;

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
