import {
  OK,
  CREATED,
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
  ERROR_API_KEY_LIMIT_REACHED,
  ERROR_API_KEY_SLUG_TAKEN,
  ERROR_API_KEY_SLUG_NOT_FOUND,
  ERROR_API_KEY_ORIGIN,
  ERROR_API_KEY_VALUE,
} from "../config/constants";
import { RequestHandler } from "express";
import throwError from "../util/throwError";
import catchErrors from "../util/catchErrors";
import { setAuthCookies } from "../util/cookie";
import prismaClient, { CodeType } from "../db/client";
import { connectToApiSession, processVerificationCode } from "../services/auth";
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
    userAgent,
  } = ApiKeyGenerateSchema.parse({
    ...(req.body as GenerateApiKeyBody),
    userAgent: req.headers["user-agent"],
  });

  const tooManyApiKeys = await prismaClient.apiKey.maxExceeded(profileId);
  throwError(!tooManyApiKeys, FORBIDDEN, ERROR_API_KEY_LIMIT_REACHED);

  const slugExists = await prismaClient.apiKey.findUnique({
    where: { slug },
  });
  throwError(!slugExists, CONFLICT, ERROR_API_KEY_SLUG_TAKEN);

  await processVerificationCode({
    profileId,
    value: verificationCode,
    codeType: CodeType.CREATE_API_KEY,
    userAgent,
  });

  const value = prismaClient.apiKey.generateKeyValue();
  await prismaClient.apiKey.issue({
    data: {
      profileId,
      slug,
      origin,
      value,
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
  const {
    apiSlug: slug,
    apiKey: value,
    userAgent,
  } = ApiKeyConnectSchema.parse({
    ...(req.body as LoginWithApiKeyBody),
    userAgent: req.headers["user-agent"],
  });
  const origin = req.get("origin");
  const apiKey = await prismaClient.apiKey.findUnique({
    where: { slug },
  });
  throwError(apiKey, NOT_FOUND, ERROR_API_KEY_SLUG_NOT_FOUND);

  const originMatch = apiKey.origin === origin;
  throwError(originMatch, UNAUTHORIZED, ERROR_API_KEY_ORIGIN);

  const apiKeyIsValid = await apiKey.validate(value);
  throwError(apiKeyIsValid, UNAUTHORIZED, ERROR_API_KEY_VALUE);

  const { session, ...tokens } = await connectToApiSession({
    apiKey,
    userAgent,
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
