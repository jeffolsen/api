import {
  UPDATE_EMAIL_SCOPE,
  UPDATE_PASSWORD_SCOPE,
  UPDATE_SESSION_SCOPE,
  READ_PROFILE_SCOPE,
  UPDATE_PROFILE_SCOPE,
  DELETE_PROFILE_SCOPE,
} from "../config/constants";

export type JoinScopesArgs = string[];
export type SplitScopesArgs = string;

export const preAuthProfileScope = () =>
  createScopeString([
    UPDATE_EMAIL_SCOPE,
    UPDATE_PASSWORD_SCOPE,
    UPDATE_SESSION_SCOPE,
  ]);

export const defaultProfileScope = () =>
  createScopeString([
    UPDATE_EMAIL_SCOPE,
    UPDATE_PASSWORD_SCOPE,
    UPDATE_SESSION_SCOPE,
    READ_PROFILE_SCOPE,
    UPDATE_PROFILE_SCOPE,
    DELETE_PROFILE_SCOPE,
  ]);

const DELIMITER = " ";

export const createScopeString = (scopes: JoinScopesArgs) =>
  scopes.join(DELIMITER);

export const parseScopeString = (scopes: SplitScopesArgs) =>
  scopes.split(DELIMITER);
