import { MAX_PROFILE_API_KEYS } from "@config/constants";
import { randomUUID } from "node:crypto";
import { ProfileGetPayload } from "@/generated/prisma/models";

export const generateApiKeyValue = () => randomUUID();

export const isApiKeyLimitReached = (
  profile: ProfileGetPayload<{ include: { apiKeys: true } }>,
) => {
  return profile.apiKeys.length === MAX_PROFILE_API_KEYS;
};
