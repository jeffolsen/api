import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, CONFLICT, CREATED, OK } from "../config/constants";
import prismaClient, { CodeType } from "../db/client";
import throwError from "../util/throwError";
import { processVerificationCode } from "../services/auth";

export const getProfilesApiKeys: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;

    const apiKeys = await prismaClient.apiKey.findMany({
      where: {
        profileId,
      },
      omit: { value: true },
    });

    res.status(OK).json(apiKeys);
  },
);

interface CreateApiKeyBody {
  slug: string;
  domain: string;
  value: string;
}

export const createApiKey: RequestHandler<
  unknown,
  unknown,
  CreateApiKeyBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId } = req;
  const { slug: apiSlug, value: verificationCode, domain } = req.body;
  throwError(
    apiSlug && verificationCode && domain,
    BAD_REQUEST,
    "Slug and code is required",
  );

  const tooManyApiKeys = await prismaClient.apiKey.maxExceeded(profileId);
  throwError(!tooManyApiKeys, CONFLICT, "Max number of apikeys reached");

  const validSlug = await prismaClient.apiKey.checkSlug(apiSlug);
  throwError(validSlug, BAD_REQUEST, "Slug format not allowed");

  const validDomain = await prismaClient.apiKey.checkDomain(domain);
  throwError(validDomain, BAD_REQUEST, "Domain format not allowed");

  const slugExists = await prismaClient.apiKey.findUnique({
    where: { slug: apiSlug },
  });
  throwError(!slugExists, CONFLICT, "Slug already taken");

  const usedVerificationCode = await processVerificationCode({
    profileId,
    value: verificationCode,
    codeType: CodeType.CREATE_API_KEY,
  });
  const apiKeyValue = await prismaClient.apiKey.generateKeyValue();

  await prismaClient.apiKey.create({
    data: { profileId, value: apiKeyValue, slug: apiSlug, domain },
  });

  res.status(CREATED).json({ apiKey: apiKeyValue });
});

const apiKeyApi = {
  getProfilesApiKeys,
  createApiKey,
};

export default apiKeyApi;
