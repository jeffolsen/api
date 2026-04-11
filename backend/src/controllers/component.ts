import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient, { type Prisma } from "../db/client";
import { NO_CONTENT, NOT_FOUND, OK } from "../config/errorCodes";
import throwError from "../util/throwError";
import {
  CreateComponentSchema,
  ModifyComponentSchema,
  UpdateComponentSchema,
} from "../schemas/component";
import {
  orderFeedsComponents,
  validateComponentPropertyValues,
} from "../services/components";
import {
  MESSAGE_COMPONENT_TYPE_NOT_FOUND,
  MESSAGE_COMPONENTS_NOT_FOUND,
  MESSAGE_FEED_NOT_FOUND,
} from "../config/errorMessages";

export const getAllComponents: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    res.sendStatus(OK);
  },
);

export const getComponentById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    const component = await prismaClient.component.findFirst({
      where: { id: Number(id), feed: { profileId } },
    });
    throwError(component, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);
    res.status(OK).json({ component });
  },
);

interface CreateComponentBody {
  feedId: number;
  typeId: number;
  name: string;
  order: number;
  propertyValues?: Record<string, unknown>;
  publishedAt?: string;
  expiredAt?: string;
}

export const createComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const {
      feedId,
      typeId,
      name,
      order,
      propertyValues,
      publishedAt,
      expiredAt,
    } = CreateComponentSchema.parse(req.body as CreateComponentBody);

    const componentType = await prismaClient.componentType.findUnique({
      where: { id: typeId },
    });
    throwError(componentType, NOT_FOUND, MESSAGE_COMPONENT_TYPE_NOT_FOUND);
    await validateComponentPropertyValues(componentType, propertyValues || {});

    const feed = await prismaClient.feed.findUnique({
      where: { id: feedId, profileId },
      include: { components: { orderBy: { order: "asc" } } },
    });
    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    // order is 1 indexed, if order is not provided, it will be added to the end of the feed's components
    const newOrder = order || feed.components.length + 1;
    const componentsToReorder = orderFeedsComponents({
      components: feed.components,
      component: null,
      newOrder,
    });

    const component = await prismaClient.$transaction(async (tx) => {
      for (const comp of componentsToReorder) {
        await tx.component.update({
          where: { id: comp.id },
          data: { order: comp.order },
        });
      }

      return tx.component.create({
        data: {
          feedId,
          typeId,
          typeName: componentType.name,
          name,
          order: newOrder,
          propertyValues: propertyValues as Prisma.InputJsonValue,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
          expiredAt: expiredAt ? new Date(expiredAt) : null,
        },
      });
    });

    res.status(OK).json({ component });
  },
);

interface UpdateComponentBody {
  order: number;
  name: string;
  propertyValues?: Record<string, unknown>;
  publishedAt?: string;
  expiredAt?: string;
}

export const updateComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    const { order, name, propertyValues, publishedAt, expiredAt } =
      UpdateComponentSchema.parse({ ...(req.body as UpdateComponentBody), id });

    const component = await prismaClient.component.findUnique({
      where: { id: Number(id), feed: { profileId } },
      include: {
        feed: { include: { components: { orderBy: { order: "asc" } } } },
      },
    });
    throwError(component, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);

    const componentType = await prismaClient.componentType.findUnique({
      where: { id: component.typeId },
    });
    throwError(componentType, NOT_FOUND, MESSAGE_COMPONENT_TYPE_NOT_FOUND);
    await validateComponentPropertyValues(componentType, propertyValues || {});

    const newOrder = order || component.order;
    const componentsToReorder = orderFeedsComponents({
      components: component.feed.components,
      component,
      newOrder,
    });

    const updatedComponent = await prismaClient.$transaction(async (tx) => {
      const tempOrder = component.feed.components.length + 1;
      await tx.component.update({
        where: { id: Number(id) },
        data: { order: tempOrder },
      });

      for (const comp of componentsToReorder) {
        await tx.component.update({
          where: { id: comp.id },
          data: { order: comp.order },
        });
      }

      return tx.component.update({
        where: { id: Number(id) },
        data: {
          name,
          order: newOrder,
          ...(propertyValues && {
            propertyValues: propertyValues as Prisma.InputJsonValue,
          }),
          ...(publishedAt && { publishedAt: new Date(publishedAt) }),
          ...(expiredAt && { expiredAt: new Date(expiredAt) }),
        },
      });
    });

    res.status(OK).json({ component: updatedComponent });
  },
);

interface ModifyComponentBody {
  name?: string;
  order?: number;
  propertyValues?: Record<string, unknown>;
  publishedAt?: string;
  expiredAt?: string;
}

export const modifyComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    const { name, order, propertyValues, publishedAt, expiredAt } =
      ModifyComponentSchema.parse(req.body as ModifyComponentBody);

    const component = await prismaClient.component.findUnique({
      where: { id: Number(id), feed: { profileId } },
      include: {
        feed: { include: { components: { orderBy: { order: "asc" } } } },
      },
    });
    throwError(component, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);

    if (typeof propertyValues === "object" && propertyValues !== null) {
      const componentType = await prismaClient.componentType.findUnique({
        where: { id: component.typeId },
      });
      throwError(componentType, NOT_FOUND, MESSAGE_COMPONENT_TYPE_NOT_FOUND);
      await validateComponentPropertyValues(componentType, propertyValues);
    }

    const newOrder = order || component.order;
    const componentsToReorder = orderFeedsComponents({
      components: component.feed.components,
      component,
      newOrder,
    });

    const updatedComponent = await prismaClient.$transaction(async (tx) => {
      const tempOrder = component.feed.components.length + 1;
      await tx.component.update({
        where: { id: Number(id) },
        data: { order: tempOrder },
      });

      for (const comp of componentsToReorder) {
        await tx.component.update({
          where: { id: comp.id },
          data: { order: comp.order },
        });
      }

      return tx.component.update({
        where: { id: Number(id) },
        data: {
          ...(name && { name }),
          ...(order && { order: newOrder }),
          ...(propertyValues && {
            propertyValues: propertyValues as Prisma.InputJsonValue,
          }),
          ...(publishedAt && { publishedAt: new Date(publishedAt) }),
          ...(expiredAt && { expiredAt: new Date(expiredAt) }),
        },
      });
    });

    res.status(OK).json({ component: updatedComponent });
  },
);

export const deleteComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};

    const component = await prismaClient.component.findUnique({
      where: { id: Number(id) },
    });
    throwError(component, NOT_FOUND, MESSAGE_COMPONENTS_NOT_FOUND);

    const feed = await prismaClient.feed.findUnique({
      where: { id: component.feedId },
      include: { components: { orderBy: { order: "asc" } } },
    });

    throwError(feed, NOT_FOUND, MESSAGE_FEED_NOT_FOUND);

    const componentsToReorder = orderFeedsComponents({
      components: feed.components,
      component,
    });

    await prismaClient.$transaction([
      prismaClient.component.delete({ where: { id: component.id } }),
      ...componentsToReorder.map((c) =>
        prismaClient.component.update({
          where: { id: c.id },
          data: { order: c.order },
        }),
      ),
    ]);

    res.sendStatus(NO_CONTENT);
  },
);

const componentApi = {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  modifyComponent,
  deleteComponent,
};
export default componentApi;
