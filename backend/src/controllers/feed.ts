import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient, { SubjectType } from "../db/client";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/errorCodes";
import { idStringSchema } from "../schemas/properties";
import { CreateFeedBodySchema, GetAllFeedsQuerySchema } from "../schemas/feed";
import { getPagination, getSortOrders } from "../util/misc";

type GetFeedsQuery = {
  subjectTypes?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export const getAllFeeds: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { subjectTypes, sort, page, pageSize } = GetAllFeedsQuerySchema.parse(
      req.query as GetFeedsQuery,
    );

    const where = {
      profileId,
      ...(subjectTypes.length && {
        subjectType: { in: subjectTypes },
      }),
    } as const;

    const [feeds, totalCount] = await prismaClient.$transaction([
      prismaClient.feed.findMany({
        where,
        ...getSortOrders(sort),
        ...getPagination(page, pageSize),
        omit: { profileId: true },
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
