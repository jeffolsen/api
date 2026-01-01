import {
  READ_PROFILE_SCOPE,
  UPDATE_PROFILE_SCOPE,
  READ_SESSION_SCOPE,
  READ_VERIFICATION_CODE_SCOPE,
  UPDATE_SESSION_SCOPE,
  READ_FEED_SCOPE,
  CREATE_API_KEY_SCOPE,
  READ_API_KEY_SCOPE,
} from "../config/constants";

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

export const defaultApiKeyScope = () => createScopeString([READ_FEED_SCOPE]);

export const API_KEY_SESSION = "API_KEY_SESSION";
export const PROFILE_SESSION = "PROFILE_SESSION";
export type ScopeType = typeof API_KEY_SESSION | typeof PROFILE_SESSION;

export const getScope = (scopeCode: ScopeType) => {
  const authScope =
    scopeCode === API_KEY_SESSION
      ? defaultApiKeyScope()
      : scopeCode === PROFILE_SESSION
        ? defaultProfileScope()
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
