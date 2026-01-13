import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../config/constants";
import prismaClient, { CodeType } from "../db/client";
import throwError from "../util/throwError";
import { connectToApiSession, processVerificationCode } from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import { ApiKeyConnectSchema, ApiKeyGenerateSchema } from "../schemas/apikey";

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
  apiSlug: string;
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
  const {
    apiSlug: slug,
    verificationCode,
    origin,
  } = ApiKeyGenerateSchema.parse({
    ...(req.body as GenerateApiKeyBody),
  });
  const tooManyApiKeys = await prismaClient.apiKey.maxExceeded(profileId);
  throwError(!tooManyApiKeys, FORBIDDEN, "Max number of apikeys reached");

  const slugExists = await prismaClient.apiKey.findUnique({
    where: { slug },
  });
  throwError(!slugExists, CONFLICT, "Slug already taken");

  await processVerificationCode({
    profileId,
    value: verificationCode,
    codeType: CodeType.CREATE_API_KEY,
  });

  // const value = prismaClient.apiKey.generateKeyValue();
  const value = await prismaClient.apiKey.issue({
    data: {
      profileId,
      slug,
      origin,
    },
  });

  res.status(CREATED).json({ apiKey: value });
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
  const { apiSlug: slug, apiKey: value } = ApiKeyConnectSchema.parse({
    ...(req.body as LoginWithApiKeyBody),
  });
  const origin = req.get("origin");
  const apiKey = await prismaClient.apiKey.findUnique({
    where: { slug },
  });
  throwError(apiKey, NOT_FOUND, "API slug not found");

  const originMatch = apiKey.origin === origin;
  throwError(originMatch, UNAUTHORIZED, "Invalid origin");

  const apiKeyIsValid = await apiKey.validate(value);
  throwError(apiKeyIsValid, UNAUTHORIZED, "Invalid api key");

  const { session, ...tokens } = await connectToApiSession(apiKey);

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
