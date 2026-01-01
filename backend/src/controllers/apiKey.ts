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
  } = (req.body as GenerateApiKeyBody) || {};
  throwError(
    slug && verificationCode && origin,
    BAD_REQUEST,
    "Slug and code is required",
  );

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
  const apiKeyValue = prismaClient.apiKey.generateKeyValue();

  await prismaClient.apiKey.create({
    data: {
      profileId,
      value: apiKeyValue,
      slug,
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
  const { apiSlug: slug, apiKey: apiKeyString } =
    (req.body as LoginWithApiKeyBody) || {};
  const origin = req.get("origin");
  throwError(slug && apiKeyString, BAD_REQUEST, "apiSlug and apiKey required");

  const apiKey = await prismaClient.apiKey.findUnique({
    where: { slug },
  });
  throwError(apiKey, NOT_FOUND, "API slug not found");

  const originMatch = apiKey.origin === origin;
  throwError(originMatch, UNAUTHORIZED, "Invalid origin");

  const apiKeyIsValid = await apiKey.validate(apiKeyString);
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
