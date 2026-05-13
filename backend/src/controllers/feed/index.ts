import { Request, RequestHandler, Response } from "express";
import prismaClient, { Prisma, SubjectType } from "@db/client";
import catchErrors from "@util/catchErrors";
import { NOT_FOUND, OK } from "@config/errorCodes";
import { idStringSchema } from "@schemas/properties";
import {
  GetAllFeedsQuerySchema,
  GetFeedIncludesQuerySchema,
  CreateFeedBodySchema,
  UpdateFeedBodySchema,
  DeleteFeedParamsSchema,
  ModifyFeedBodySchema,
  FeedIncludeField,
} from "@schemas/feed";
import { getPagination, getSortOrders } from "@util/misc";
import throwError from "@util/throwError";
import { MESSAGE_FEED_NOT_FOUND } from "@config/errorMessages";

type GetFeedsQuery = {
  searchPath?: string;
  subjectTypes?: string;
  ids?: string;
  paths?: string;
  sort?: string;
  includes?: string;
  page?: number;
  pageSize?: number;
};

const buildFeedInclude = (
  includes: FeedIncludeField[],
): Prisma.FeedInclude | undefined => {
  if (!includes.length) return undefined;
  return {
    ...(includes.includes("tags") && {
      tags: { include: { tag: true } },
    }),
    ...(includes.includes("components") && {
      components: true,
    }),
  };
};

const setFeedTags = async (
  tx: Prisma.TransactionClient,
  feedId: number,
  tagIds: number[],
) => {
  await tx.feedTag.deleteMany({ where: { feedId } });
  if (tagIds.length) {
    await tx.feedTag.createMany({
      data: tagIds.map((tagId) => ({ feedId, tagId })),
    });
  }
};

export const getAllFeeds: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetFeedsQuery
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const {
    ids,
    paths,
    subjectTypes,
    sort,
    page,
    pageSize,
    searchPath,
    includes,
  } = GetAllFeedsQuerySchema.parse(req.query);

  const where = {
    profileId,
    ...(searchPath && {
      path: { contains: searchPath },
    }),
    ...(ids.length && {
      id: { in: ids },
    }),
    ...(paths.length && {
      path: { in: paths },
    }),
    ...(subjectTypes.length && {
      subjectType: { in: subjectTypes },
    }),
  };

  const include = buildFeedInclude(includes);

  const [feeds, totalCount] = await prismaClient.$transaction([
    prismaClient.feed.findMany({
      where,
      include,
      ...getSortOrders(sort),
      ...getPagination(page, pageSize),
    }),
    prismaClient.feed.count({ where }),
  ]);
  res.status(OK).json({ feeds, totalCount });
});

export const getFeedById: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const id = idStringSchema.parse(req.params.id);
    const { includes } = GetFeedIncludesQuerySchema.parse(req.query);

    const feed = await prismaClient.feed.findFirst({
      where: { id, profileId },
      include: buildFeedInclude(includes),
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
  includes?: string;
};

export const getFeedByPath: RequestHandler<
  GetFeedByPathParams,
  unknown,
  unknown,
  GetFeedByPathQuery
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const { path } = req.params;
  const { subjectType: st } = req.query;
  const { includes } = GetFeedIncludesQuerySchema.parse(req.query);

  const subjectType = st === "SINGLE" ? "SINGLE" : "COLLECTION";

  const feed = await prismaClient.feed.findFirst({
    where: { path, profileId, subjectType },
    include: buildFeedInclude(includes),
  });

  throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);
  res.status(OK).json({ feed });
});

type CreateFeedBody = {
  path: string;
  subjectType: SubjectType;
  publishedAt?: string;
  expiredAt?: string;
  tagIds?: number[];
};

export const createFeed: RequestHandler<
  unknown,
  unknown,
  CreateFeedBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const { path, subjectType, publishedAt, expiredAt, tagIds } =
    CreateFeedBodySchema.parse(req.body);

  const feed = await prismaClient.$transaction(async (tx) => {
    const created = await tx.feed.create({
      data: {
        path,
        subjectType,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        profileId,
      },
    });
    if (tagIds?.length) {
      await setFeedTags(tx, created.id, tagIds);
    }
    return created;
  });

  res.status(OK).json({ feed });
});

type UpdateFeedBody = {
  path?: string;
  publishedAt?: string;
  expiredAt?: string;
  tagIds?: number[];
};

export const updateFeed: RequestHandler<
  unknown,
  unknown,
  UpdateFeedBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const { id, path, publishedAt, expiredAt, tagIds } =
    UpdateFeedBodySchema.parse({
      ...(req.body as UpdateFeedBody),
      id: req.params.id,
    });

  const feed = await prismaClient.$transaction(async (tx) => {
    const existing = await tx.feed.findFirst({ where: { id, profileId } });
    throwError(existing, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    const updated = await tx.feed.update({
      where: { id, profileId },
      data: {
        path,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      },
    });

    if (tagIds !== undefined) {
      await setFeedTags(tx, id, tagIds);
    }

    return updated;
  });

  res.status(OK).json({ feed });
});

type ModifyFeedBody = {
  path?: string;
  publishedAt?: string;
  expiredAt?: string;
  tagIds?: number[];
};

export const modifyFeed: RequestHandler<
  unknown,
  unknown,
  ModifyFeedBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const { id, path, publishedAt, expiredAt, tagIds } =
    ModifyFeedBodySchema.parse({
      ...req.body,
      id: req.params.id,
    });

  const feed = await prismaClient.$transaction(async (tx) => {
    const existing = await tx.feed.findFirst({ where: { id, profileId } });
    throwError(existing, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    const updated = await tx.feed.update({
      where: { id, profileId },
      data: {
        ...(path && { path }),
        ...(publishedAt === undefined
          ? {}
          : publishedAt === null
            ? { publishedAt: null }
            : { publishedAt: new Date(publishedAt) }),
        ...(expiredAt === undefined
          ? {}
          : expiredAt === null
            ? { expiredAt: null }
            : { expiredAt: new Date(expiredAt) }),
      },
    });

    if (tagIds !== undefined) {
      await setFeedTags(tx, id, tagIds);
    }

    return updated;
  });

  res.status(OK).json({ feed });
});

export const deleteFeed: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { id } = DeleteFeedParamsSchema.parse(req.params);

    await prismaClient.$transaction(async (tx) => {
      const feed = await tx.feed.findFirst({ where: { id, profileId } });
      throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);
      await tx.feed.delete({ where: { id, profileId } });
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
  modifyFeed,
  deleteFeed,
};
export default feedApi;
