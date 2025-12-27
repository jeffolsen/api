import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, CONFLICT, CREATED, OK } from "../config/constants";
import prismaClient from "../db/client";
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
}

export const createApiKey: RequestHandler<
  unknown,
  unknown,
  CreateApiKeyBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { slug: apiSlug, value: verificationCode } = req.body;
  throwError(
    apiSlug && verificationCode,
    BAD_REQUEST,
    "Slug and code is required",
  );

  const tooManyApiKeys = await prismaClient.apiKey.maxExceeded(profileId);
  throwError(!tooManyApiKeys, CONFLICT, "Max number of apikeys reached");

  const validSlug = await prismaClient.apiKey.checkSlug(apiSlug);
  throwError(!validSlug, BAD_REQUEST, "Slug format not allowed");

  const slugExists = await prismaClient.apiKey.findUnique({
    where: { slug: apiSlug },
  });
  throwError(!slugExists, CONFLICT, "Slug already taken");

  await processVerificationCode({
    profileId,
    sessionId,
    type: "CREATE_API_KEY",
    value: verificationCode,
  });
  const apiKeyValue = await prismaClient.apiKey.generateKeyValue();

  await prismaClient.apiKey.create({
    data: { profileId, value: apiKeyValue, slug: apiSlug },
  });

  res.status(CREATED).json({ apiKey: apiKeyValue });
});

const apiKeyApi = {
  getProfilesApiKeys,
  createApiKey,
};

export default apiKeyApi;
