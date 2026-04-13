import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient, { SubjectType } from "../db/client";
import catchErrors from "../util/catchErrors";
import { NOT_FOUND, OK } from "../config/errorCodes";
import { idStringSchema } from "../schemas/properties";
import {
  GetAllFeedsQuerySchema,
  CreateFeedBodySchema,
  UpdateFeedBodySchema,
  DeleteFeedParamsSchema,
} from "../schemas/feed";
import { getPagination, getSortOrders } from "../util/misc";
import throwError from "../util/throwError";
import { MESSAGE_FEED_NOT_FOUND } from "../config/errorMessages";

type GetFeedsQuery = {
  searchPath?: string;
  subjectTypes?: string;
  ids?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export const getAllFeeds: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { ids, subjectTypes, sort, page, pageSize, searchPath } =
      GetAllFeedsQuerySchema.parse(req.query as GetFeedsQuery);

    const where = {
      profileId,
      ...(searchPath && {
        path: { contains: searchPath },
      }),
      ...(ids.length && {
        id: { in: ids },
      }),
      ...(subjectTypes.length && {
        subjectType: { in: subjectTypes },
      }),
    } as const;

    const [feeds, totalCount] = await prismaClient.$transaction([
      prismaClient.feed.findMany({
        where,
        ...getSortOrders(sort),
        ...getPagination(page, pageSize),
      }),
      prismaClient.feed.count({ where }),
    ]);
    res.status(OK).json({ feeds, totalCount });
  },
);

export const getFeedById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const id = idStringSchema.parse(req.params.id); // Validate id

    const feed = await prismaClient.feed.findFirst({
      where: { id, profileId },
    });

    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);
    res.status(OK).json({ feed });
  },
);

type GetFeedByPathParams = {
  path: string;
};

type GetFeedByPathQuery = {
  subjectType?: string;
};

export const getFeedByPath: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { path } = req.params as GetFeedByPathParams;
    const { subjectType: st } = req.query as GetFeedByPathQuery;

    const subjectType =
      st === "SINGLE" ? "SINGLE" : ("COLLECTION" as SubjectType);

    const feed = await prismaClient.feed.findFirst({
      where: { path, profileId, subjectType },
    });

    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);
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
    const { path, subjectType, publishedAt, expiredAt } =
      CreateFeedBodySchema.parse(req.body as CreateFeedBody);
    const feed = await prismaClient.feed.create({
      data: {
        path,
        subjectType,
        publishedAt,
        expiredAt,
        profileId,
      },
    });
    res.status(OK).json({ feed });
  },
);

type UpdateFeedBody = {
  path?: string;
  publishedAt?: string;
  expiredAt?: string;
};

export const updateFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id, path, publishedAt, expiredAt } = UpdateFeedBodySchema.parse({
      ...(req.body as UpdateFeedBody),
      id: req.params.id,
    });
    const feed = await prismaClient.feed.findFirst({
      where: { id, profileId },
    });
    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    const updatedFeed = await prismaClient.feed.update({
      where: { id, profileId },
      data: {
        path,
        publishedAt,
        expiredAt,
      },
    });
    res.status(OK).json({ feed: updatedFeed });
  },
);

export const deleteFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = DeleteFeedParamsSchema.parse(req.params);
    const feed = await prismaClient.feed.findFirst({
      where: { id, profileId },
    });
    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    await prismaClient.feed.delete({
      where: { id, profileId },
    });
    res.sendStatus(OK);
  },
);

const feedApi = {
  getAllFeeds,
  getFeedById,
  getFeedByPath,
  createFeed,
  updateFeed,
  deleteFeed,
};
export default feedApi;
