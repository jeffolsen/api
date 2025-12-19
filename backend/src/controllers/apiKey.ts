import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, NOT_FOUND, OK } from "../config/constants";
import prismaClient from "../db/client";
import throwError from "../util/throwError";
import { initSession } from "../services/auth";
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
  const { slug, domain } = req.body;
  const { profileId, sessionId } = req;

  throwError(slug && domain, BAD_REQUEST, "email is required");

  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(profile, NOT_FOUND, "invalid credentials");
});

const apiKeyApi = {
  getProfilesApiKeys,
};

export default apiKeyApi;
