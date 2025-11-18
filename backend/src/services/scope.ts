export const readProfileScope = "read:profile";
export const updateProfileScope = "update:profile";
export const deleteProfileScope = "delete:profile";

export const readSessionScope = "read:session";
export const deleteSessionScope = "read:session";

export type JoinScopesArgs = string[];
export type SplitScopesArgs = string;

export const joinScopes = (scopes: JoinScopesArgs) => scopes.join(" ");
export const splitScopes = (scopes: SplitScopesArgs) => scopes.split(" ");
