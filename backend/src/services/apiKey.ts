import prismaClient from "../db/client";
import { MAX_PROFILE_API_KEYS } from "../config/constants";
import { randomUUID } from "node:crypto";

export const generateApiKeyValue = () => randomUUID();

export const isApiKeyLimitReached = async (profileId: number) => {
  const apiKeys = await prismaClient.apiKey.findMany({
    where: { profileId },
    take: MAX_PROFILE_API_KEYS,
  });
  return apiKeys.length === MAX_PROFILE_API_KEYS;
};
