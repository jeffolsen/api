import {
  LOGOUT_ALL_SCOPE,
  PASSWORD_RESET_SCOPE,
  DELETE_PROFILE_SCOPE,
  READ_PROFILE_SCOPE,
  UPDATE_PROFILE_SCOPE,
  READ_SESSION_SCOPE,
  READ_VERIFICATION_CODE_SCOPE,
  UPDATE_SESSION_SCOPE,
  READ_PAGE_SCOPE,
  CREATE_API_KEY_SCOPE,
  READ_API_KEY_SCOPE,
} from "../config/constants";
import { CodeType } from "../db/client";

export const defaultProfileScope = () =>
  createScopeString([
    UPDATE_PROFILE_SCOPE,
    UPDATE_SESSION_SCOPE,
    READ_PROFILE_SCOPE,
    READ_SESSION_SCOPE,
    READ_VERIFICATION_CODE_SCOPE,
    READ_API_KEY_SCOPE,
    CREATE_API_KEY_SCOPE,
  ]);

export const defaultApiKeyScope = () => createScopeString([READ_PAGE_SCOPE]);

export const API_KEY_SESSION = "API_KEY_SESSION";
export type ScopeCodeType = CodeType | typeof API_KEY_SESSION;

export const getScope = (scopeCode: ScopeCodeType) => {
  const authScope =
    scopeCode === API_KEY_SESSION
      ? defaultApiKeyScope()
      : scopeCode === CodeType.LOGIN
        ? defaultProfileScope()
        : scopeCode === CodeType.LOGOUT_ALL
          ? LOGOUT_ALL_SCOPE
          : scopeCode === CodeType.PASSWORD_RESET
            ? PASSWORD_RESET_SCOPE
            : scopeCode === CodeType.DELETE_PROFILE
              ? DELETE_PROFILE_SCOPE
              : scopeCode === CodeType.CREATE_API_KEY
                ? CREATE_API_KEY_SCOPE
                : "";
  return authScope ? createScopeString([authScope]) : authScope;
};

const DELIMITER = " ";
export type JoinScopesArgs = string[];
export type SplitScopesArgs = string;

export const createScopeString = (scopes: JoinScopesArgs) =>
  scopes.join(DELIMITER);

export const parseScopeString = (scopes: SplitScopesArgs) =>
  scopes.split(DELIMITER);
