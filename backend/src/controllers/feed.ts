import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient, { SubjectType } from "../db/client";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/errorCodes";
import { idSchema } from "../schemas/properties";

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
    const id = idSchema.parse(req.params.id); // Validate id
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
  components?: {
    componentTypeName: string;
    propertyValues?: Record<string, unknown>;
  }[];
};

export const createFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    // const data = CreateFeedBodySchema.parse(req.body as CreateFeedBody); // Validate request body against schema
    res.sendStatus(OK);
  },
);

export const updateFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

export const deleteFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
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
