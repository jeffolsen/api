import {
  LOGIN_SCOPE,
  LOGOUT_ALL_SCOPE,
  PASSWORD_RESET_SCOPE,
  DELETE_PROFILE_SCOPE,
  READ_PROFILE_SCOPE,
  UPDATE_PROFILE_SCOPE,
  READ_SESSION_SCOPE,
  READ_VERIFICATION_CODE_SCOPE,
  UPDATE_SESSION_SCOPE,
} from "../config/constants";
import { CodeType } from "../db/client";

export type JoinScopesArgs = string[];
export type SplitScopesArgs = string;

export const preAuthProfileScope = (scopeCode: CodeType) => {
  const authScope =
    scopeCode === "LOGIN"
      ? LOGIN_SCOPE
      : scopeCode === "LOGOUT_ALL"
      ? LOGOUT_ALL_SCOPE
      : scopeCode === "PASSWORD_RESET"
      ? PASSWORD_RESET_SCOPE
      : scopeCode === "DELETE_PROFILE"
      ? DELETE_PROFILE_SCOPE
      : "";
  return authScope
    ? createScopeString([authScope, UPDATE_SESSION_SCOPE])
    : authScope;
};

export const defaultProfileScope = () =>
  createScopeString([
    UPDATE_PROFILE_SCOPE,
    UPDATE_SESSION_SCOPE,
    READ_PROFILE_SCOPE,
    READ_SESSION_SCOPE,
    READ_VERIFICATION_CODE_SCOPE,
  ]);

const DELIMITER = " ";

export const createScopeString = (scopes: JoinScopesArgs) =>
  scopes.join(DELIMITER);

export const parseScopeString = (scopes: SplitScopesArgs) =>
  scopes.split(DELIMITER);
