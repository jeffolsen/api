import { NextFunction, Request, RequestHandler, Response } from "express";
import { NOT_FOUND, OK } from "../config/errorCodes";
import catchErrors from "../util/catchErrors";
import throwError from "../util/throwError";
import prismaClient from "../db/client";
import {
  GetFeedsResourcesSchema,
  GetFeedsResourceByIdSchema,
} from "../schemas/feed";
import {
  MESSAGE_FEED_NOT_FOUND,
  MESSAGE_COMPONENTS_NOT_FOUND,
} from "../config/errorMessages";

export const getFeedComponents: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { feedId: id } = GetFeedsResourcesSchema.parse(req.params);

    const feed = await prismaClient.feed.findFirst({
      where: { id, profileId },
      include: { components: true },
    });

    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);
    const components = await prismaClient.component.findMany({
      where: {
        id: { in: feed.components.map((component) => component.id) },
      },
    });
    throwError(components, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);

    res.status(OK).send({ components });
  },
);

export const getFeedComponentsById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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

export const deleteFeedComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { feedId, id } = GetFeedsResourceByIdSchema.parse(req.params);

    const feed = await prismaClient.feed.findFirst({
      where: { id: feedId, profileId },
      include: { components: true },
    });
    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    const component = feed.components.find((component) => component.id === id);
    throwError(component, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);

    await prismaClient.component.delete({ where: { id } });

    res.status(OK).send({ message: "Component deleted successfully" });
  },
);

const feedComponentsApi = {
  getFeedComponents,
  getFeedComponentsById,
};
export default feedComponentsApi;
