import {
  DELETE_PROFILE_SCOPE,
  READ_PROFILE_SCOPE,
  UPDATE_PROFILE_SCOPE,
} from "../config/constants";

export type JoinScopesArgs = string[];
export type SplitScopesArgs = string;

export const defaultProfileScope = () =>
  joinScopes([READ_PROFILE_SCOPE, UPDATE_PROFILE_SCOPE, DELETE_PROFILE_SCOPE]);

export const joinScopes = (scopes: JoinScopesArgs) => scopes.join(" ");
export const splitScopes = (scopes: SplitScopesArgs) => scopes.split(" ");
