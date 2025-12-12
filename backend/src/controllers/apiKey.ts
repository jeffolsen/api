import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/constants";
import prismaClient from "../db/client";

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
  }
);

const apiKeyApi = {
  getProfilesApiKeys,
};

export default apiKeyApi;
