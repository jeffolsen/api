import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient, { SubjectType } from "../db/client";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/errorCodes";
import { idStringSchema } from "../schemas/properties";
import { CreateFeedBodySchema } from "../schemas/feed";

export const getAllFeeds: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const feeds = await prismaClient.feed.findMany({
      where: { profileId },
    });
    res.status(OK).json({ feeds });
  },
);

export const getFeedById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const id = idStringSchema.parse(req.params.id); // Validate id

    console.log(`Fetching feed with id: ${id} for profileId: ${profileId}`); // Debug log
    const feed = await prismaClient.feed.findFirst({
      where: { id, profileId },
    });
    res.status(OK).json({ feed });
  },
);

type CreateFeedBody = {
  path: string;
  subjectType: SubjectType;
  publishedAt?: string;
  expiredAt?: string;
};

export const createFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    console.log("CreateFeed request body:", req.body);
    const data = CreateFeedBodySchema.parse(req.body as CreateFeedBody);
    const feed = await prismaClient.feed.create({
      data: {
        ...data,
        profileId,
      },
    });
    res.status(OK).json({ feed });
  },
);

export const updateFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    console.log(`Updating feed with id: ${id} for profileId: ${profileId}`); // Debug log
    console.log("UpdateFeed request body:", req.body);
    res.sendStatus(OK);
  },
);

export const deleteFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    console.log("DeleteFeed request body:", req.body);
    res.sendStatus(OK);
  },
);

const feedApi = {
  getAllFeeds,
  getFeedById,
  createFeed,
  updateFeed,
  deleteFeed,
};
export default feedApi;
