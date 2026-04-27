import {
  MESSAGE_API_KEY_LIMIT_REACHED,
  MESSAGE_API_KEY_SLUG_TAKEN,
  MESSAGE_API_KEY_SLUG_NOT_FOUND,
  MESSAGE_NO_ACCESS,
  MESSAGE_CREDENTIALS,
} from "@config/errorMessages";
import {
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  CREATED,
} from "@config/errorCodes";
import { RequestHandler } from "express";
import throwError from "@util/throwError";
import catchErrors from "@util/catchErrors";
import prismaClient, { CodeType } from "@db/client";
import { processVerificationCode } from "@services/auth";
import { isApiKeyLimitReached, generateApiKeyValue } from "@services/apiKey";
import {
  ApiKeyCreateTransform,
  ApiKeyDestroySchema,
  ApiKeyGenerateSchema,
} from "@schemas/apikey";
import { Request, Response } from "express";

export const getProfilesApiKeys: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;

    const apiKeys = await prismaClient.apiKey.findMany({
      where: {
        profileId,
      },
      omit: { value: true },
    });

    res.status(OK).json({ apiKeys });
  },
);

interface GenerateApiKeyBody {
  apiSlug: string;
  origin: string;
}

export const generate: RequestHandler<
  unknown,
  unknown,
  GenerateApiKeyBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const code = req.get("X-Verification-Code");
  const { profileId } = req;
  const {
    apiSlug: slug,
    origin,
    verificationCode,
    userAgent,
  } = ApiKeyGenerateSchema.parse({
    ...req.body,
    verificationCode: code || "",
    userAgent: req.headers["user-agent"],
  });

  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(profile, NOT_FOUND, MESSAGE_CREDENTIALS);

  const tooManyApiKeys = await isApiKeyLimitReached(profile.id);
  throwError(!tooManyApiKeys, FORBIDDEN, MESSAGE_API_KEY_LIMIT_REACHED);

  const slugExists = await prismaClient.apiKey.findUnique({
    where: { slug },
  });
  throwError(!slugExists, CONFLICT, MESSAGE_API_KEY_SLUG_TAKEN);

  await processVerificationCode({
    profileId,
    value: verificationCode,
    codeType: CodeType.CREATE_API_KEY,
    userAgent,
  });

  const value = generateApiKeyValue();
  const apiKeyData = await ApiKeyCreateTransform.parseAsync({
    profileId,
    slug,
    origin,
    value,
  });
  await prismaClient.apiKey.create({
    data: apiKeyData,
  });

  res.status(CREATED).json({ apiKey: value });
});

interface DestroyApiKeyBody {
  apiSlug: string;
}

export const destroy: RequestHandler<
  unknown,
  unknown,
  DestroyApiKeyBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const code = req.get("X-Verification-Code");

  const {
    apiSlug: slug,
    verificationCode,
    userAgent,
  } = ApiKeyDestroySchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
    verificationCode: code || "",
  });

  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(profile, NOT_FOUND, MESSAGE_CREDENTIALS);

  const apiKey = await prismaClient.apiKey.findUnique({
    where: { slug },
  });
  throwError(apiKey, NOT_FOUND, MESSAGE_API_KEY_SLUG_NOT_FOUND);
  throwError(apiKey?.profileId === profileId, FORBIDDEN, MESSAGE_NO_ACCESS);

  await processVerificationCode({
    profileId,
    value: verificationCode,
    codeType: CodeType.CREATE_API_KEY,
    userAgent,
  });

  await prismaClient.apiKey.delete({
    where: { id: apiKey.id },
  });

  res.sendStatus(OK);
});

const apiKeyApi = {
  getProfilesApiKeys,
  generate,
  destroy,
};

export default apiKeyApi;
