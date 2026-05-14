import { Request, RequestHandler, Response } from "express";
import { BAD_REQUEST, NOT_FOUND, OK } from "@config/errorCodes";
import catchErrors from "@util/catchErrors";
import throwError from "@util/throwError";
import prismaClient from "@db/client";
import {
  GetFeedsResourceByIdSchema,
  GetFeedsResourcesSchema,
} from "@schemas/feed";
import {
  MESSAGE_ITEM_NOT_FOUND,
  MESSAGE_TAGS_NOT_FOUND,
} from "@config/errorMessages";

export const getFeedTags: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { feedId } = GetFeedsResourcesSchema.parse(req.params);

    const feed = await prismaClient.feed.findUnique({
      where: {
        id: feedId,
        profileId,
      },
    });
    throwError(feed, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const tags = await prismaClient.tag.findMany({
      where: { feeds: { some: { feedId } } },
    });

    res.status(OK).send({ tags });
  },
);

export const getFeedTagById: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { feedId, id } = GetFeedsResourceByIdSchema.parse(req.params);

    const feed = await prismaClient.feed.findUnique({
      where: {
        id: feedId,
        profileId,
      },
    });
    throwError(feed, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const tag = await prismaClient.tag.findUnique({
      where: { id, feeds: { some: { feedId } } },
    });
    throwError(tag, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

    res.status(OK).send({ tag });
  },
);

const feedTagApi = {
  getFeedTags,
  getFeedTagById,
};
export default feedTagApi;
