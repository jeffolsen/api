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
} from "../config/constants";
import { CodeType } from "../db/client";

export const defaultProfileScope = () =>
  createScopeString([
    UPDATE_PROFILE_SCOPE,
    UPDATE_SESSION_SCOPE,
    READ_PROFILE_SCOPE,
    READ_SESSION_SCOPE,
    READ_VERIFICATION_CODE_SCOPE,
  ]);

export const defaultApiKeyScope = () => createScopeString([READ_PAGE_SCOPE]);

export const CONNECT_API_KEY = "CONNECT_API_KEY";
export type ScopeCodeType = CodeType | typeof CONNECT_API_KEY;

export const getScope = (scopeCode: ScopeCodeType) => {
  const authScope =
    scopeCode === CONNECT_API_KEY
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
