import { SignOptions } from "jsonwebtoken";

// resource limits
export const MAX_DAILY_SYSTEM_EMAILS = 2800;
export const MAX_MONTHLY_SYSTEM_EMAILS = 90;
export const MAX_PROFILE_SESSIONS = 1;
export const MAX_PROFILE_CODES = 15;
export const MAX_PROFILE_API_KEYS = 2;

// 4 days in ms
export const SESSION_TOKEN_LIFESPAN = 4 * 24 * 60 * 60 * 1000;
// export const SESSION_TOKEN_LIFESPAN = 4 * 60 * 1000;
export const SESSION_TOKEN_OPTIONS = {
  expiresIn: SESSION_TOKEN_LIFESPAN,
} as SignOptions;
// 15 minutes in ms
export const ACCESS_TOKEN_LIFESPAN = 15 * 60 * 1000;
// export const ACCESS_TOKEN_LIFESPAN = 1 * 60 * 1000;
export const ACCESS_TOKEN_OPTIONS = {
  expiresIn: ACCESS_TOKEN_LIFESPAN,
} as SignOptions;
// 8 hours in ms
export const VERIFICATION_CODE_LIFESPAN = 8 * 60 * 60 * 1000;

// regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NUMERIC_CODE_REGEX = /^\d{6}/;

// misc
export const ACCESS_TOKEN_NAME = "accessToken";
export const REFRESH_TOKEN_NAME = "refreshToken";
