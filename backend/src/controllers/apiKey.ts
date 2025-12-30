import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, CONFLICT, CREATED, OK } from "../config/constants";
import prismaClient, { CodeType } from "../db/client";
import throwError from "../util/throwError";
import { connectToApiSession, processVerificationCode } from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import { create } from "domain";
import { API_KEY_SESSION } from "../util/scope";

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

interface GenerateApiKeyBody {
  slug: string;
  origin: string;
  verificationCode: string;
}

export const generate: RequestHandler<
  unknown,
  unknown,
  GenerateApiKeyBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId } = req;
  const { slug: apiSlug, verificationCode, origin } = req.body || {};
  throwError(
    apiSlug && verificationCode && origin,
    BAD_REQUEST,
    "Slug and code is required",
  );

  const tooManyApiKeys = await prismaClient.apiKey.maxExceeded(profileId);
  throwError(!tooManyApiKeys, CONFLICT, "Max number of apikeys reached");

  const validSlug = await prismaClient.apiKey.checkSlug(apiSlug);
  throwError(validSlug, BAD_REQUEST, "Slug format not allowed");

  const validOrigin = await prismaClient.apiKey.checkUrl(origin);
  throwError(validOrigin, BAD_REQUEST, "Origin format not allowed");

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
    data: {
      profileId,
      value: apiKeyValue,
      slug: apiSlug,
      origin,
    },
  });

  res.status(CREATED).json({ apiKey: apiKeyValue });
});

interface LoginWithApiKeyBody {
  apiSlug: string;
  apiKey: string;
}

export const connect: RequestHandler<
  unknown,
  unknown,
  LoginWithApiKeyBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { apiSlug: apiKeySlug, apiKey: apiKeyString } = req.body;
  const origin = req.get("origin");
  throwError(
    apiKeySlug && apiKeyString,
    BAD_REQUEST,
    "apiSlug and apiKey required",
  );

  const { session, ...tokens } = await connectToApiSession({
    apiKeySlug,
    apiKeyString,
    origin,
  });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

const apiKeyApi = {
  getProfilesApiKeys,
  generate,
  connect,
};

export default apiKeyApi;
