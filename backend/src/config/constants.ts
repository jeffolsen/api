import { SignOptions } from "jsonwebtoken";

// routes
export const COLLECTION_ENDPOINT = "/";
export const SELF_ENDPOINT = "/me";
export const ID_ENDPOINT = "/:id";

export const AUTH_ROUTES = "/api/auth";
export const AUTH_REGISTER_ENDPOINT = "/register";
export const AUTH_LOGIN_ENDPOINT = "/login";
export const AUTH_REFRESH_ENDPOINT = "/refresh";

export const SESSION_ROUTES = "/api/sessions";
export const SESSION_LOGOUT_ENDPOINT = "/logout";
export const SESSION_LOGOUT_ALL_ENDPOINT = "/logout-all";

export const PROFILE_ROUTES = "/api/profiles";
export const PROFILE_PASSWORD_RESET_ENDPOINT = "/password-reset";
export const PROFILE_DELETE_PROFILE_ENDPOINT = "/unregister";

export const VERIFICATION_CODE_ROUTES = "/api/codes";
export const VERIFICATION_CODE_LOGIN_ENDPOINT = "/login";
export const VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT = "/logout-all";
export const VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT = "/password-reset";
export const VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT = "/delete-profile";
export const VERIFICATION_CREATE_API_KEY_ENDPOINT = "/generate-key";

export const API_KEY_ROUTES = "/api/keys";
export const API_KEY_GENERATE_ENDPOINT = "/generate";
export const API_KEY_PUBLIC_ENDPOINT = "/public";

export const FEED_ROUTES = "/api/feeds";
export const TAG_ROUTES = "/api/tags";
export const TAG_NAME_ENDPOINT = "/:name";
export const ITEM_ROUTES = "/api/items";
export const COMPONENT_ROUTES = "/api/components";

// profile scopes
export const READ_PROFILE_SCOPE = "read:profile";
export const UPDATE_PROFILE_SCOPE = "update:profile";
// verificationCode scopes
export const READ_VERIFICATION_CODE_SCOPE = "read:verificationCode";
// session scopes
export const READ_SESSION_SCOPE = "read:session";
export const UPDATE_SESSION_SCOPE = "update:session";
// api key scopes
export const READ_API_KEY_SCOPE = "read:apiKey";
// tag scopes
export const READ_TAG_SCOPE = "read:tag";
export const CREATE_TAG_SCOPE = "create:tag";
export const UPDATE_TAG_SCOPE = "update:tag";
export const DELETE_TAG_SCOPE = "delete:tag";
// item scopes
export const READ_ITEM_SCOPE = "read:item";
export const CREATE_ITEM_SCOPE = "create:item";
export const UPDATE_ITEM_SCOPE = "update:item";
export const DELETE_ITEM_SCOPE = "delete:item";
// component scopes
export const READ_COMPONENT_SCOPE = "read:component";
export const CREATE_COMPONENT_SCOPE = "create:component";
export const UPDATE_COMPONENT_SCOPE = "update:component";
export const DELETE_COMPONENT_SCOPE = "delete:component";
// feed scopes
export const READ_FEED_SCOPE = "read:feed";
export const CREATE_FEED_SCOPE = "create:feed";
export const UPDATE_FEED_SCOPE = "update:feed";
export const DELETE_FEED_SCOPE = "delete:feed";
// auth scopes
export const LOGOUT_ALL_SCOPE = "auth:logout-all";
export const PASSWORD_RESET_SCOPE = "auth:update-password";
export const DELETE_PROFILE_SCOPE = "auth:delete-profile";
export const CREATE_API_KEY_SCOPE = "auth:create-apiKey";

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
export const MAX_DAILY_SYSTEM_EMAILS = 2800;
export const MAX_MONTHLY_SYSTEM_EMAILS = 90;
export const MAX_PROFILE_SESSIONS = 5;
export const MAX_PROFILE_CODES = 10;
export const MAX_PROFILE_API_KEYS = 4;

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

// regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NUMERIC_CODE_REGEX = /^\d{6}/;
