import { Request, RequestHandler, Response } from "express";
import { NOT_FOUND, OK } from "@config/errorCodes";
import catchErrors from "@util/catchErrors";
import throwError from "@util/throwError";
import prismaClient from "@db/client";
import {
  GetFeedsResourcesSchema,
  GetFeedsResourceByIdSchema,
  GetFeedComponentsQuery,
} from "@schemas/feed";
import {
  MESSAGE_FEED_NOT_FOUND,
  MESSAGE_COMPONENTS_NOT_FOUND,
} from "@config/errorMessages";

type GetComponentsQuery = {
  published?: boolean;
  page?: number;
  pageSize?: number;
};

export const getFeedComponents: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { feedId: id } = GetFeedsResourcesSchema.parse(req.params);
    const { published, page, pageSize } = GetFeedComponentsQuery.parse(
      req.query,
    );

    const feed = await prismaClient.feed.findFirst({
      where: { id, profileId },
      include: { components: true },
    });

    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);
    const components = await prismaClient.component.findMany({
      where: {
        id: { in: feed.components.map((component) => component.id) },
        ...(published === true && {
          OR: [
            { publishedAt: { lte: new Date() } },
            { publishedAt: null },
            { expiredAt: { gt: new Date() } },
            { expiredAt: null },
          ],
        }),
      },
      orderBy: { order: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    throwError(components, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);

    res.status(OK).send({ components });
  },
);

export const getFeedComponentsById: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { feedId, id } = GetFeedsResourceByIdSchema.parse(req.params);

    const feed = await prismaClient.feed.findFirst({
      where: { id: feedId, profileId },
      include: { components: true },
    });
    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    const component = feed.components.find((component) => component.id === id);
    throwError(component, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);

    res.status(OK).send({ component });
  },
);

const feedComponentsApi = {
  getFeedComponents,
  getFeedComponentsById,
};
export default feedComponentsApi;
