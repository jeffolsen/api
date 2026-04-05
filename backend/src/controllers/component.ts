import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient, { type Prisma } from "../db/client";
import { NOT_FOUND, OK } from "../config/errorCodes";
import throwError from "../util/throwError";
import {
  CreateComponentSchema,
  ModifyComponentSchema,
  UpdateComponentSchema,
} from "../schemas/component";
import { validateComponentPropertyValues } from "../services/auth";

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
    throwError(component, NOT_FOUND, `Component with id ${id} not found`);
    res.status(OK).json({ component });
  },
);

interface CreateComponentBody {
  feedId: number;
  typeId: number;
  order: number;
  name: string;
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
      order,
      name,
      propertyValues,
      publishedAt,
      expiredAt,
    } = CreateComponentSchema.parse(req.body as CreateComponentBody);

    const componentType = await prismaClient.componentType.findUnique({
      where: { id: typeId },
    });
    throwError(
      componentType,
      NOT_FOUND,
      `ComponentType with id ${typeId} not found`,
    );
    await validateComponentPropertyValues(componentType, propertyValues || {});

    const feed = await prismaClient.feed.findUnique({
      where: { id: feedId, profileId },
    });
    throwError(feed, NOT_FOUND, `Feed with id ${feedId} not found`);

    const component = await prismaClient.component.create({
      data: {
        typeId: componentType.id,
        feedId,
        order,
        name,
        propertyValues: propertyValues as Prisma.InputJsonValue,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      },
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
      UpdateComponentSchema.parse(req.body as UpdateComponentBody);

    const component = await prismaClient.component.findUnique({
      where: { id: Number(id), feed: { profileId } },
    });
    throwError(component, NOT_FOUND, `Component with id ${id} not found`);

    const componentType = await prismaClient.componentType.findUnique({
      where: { id: component.typeId },
    });
    throwError(
      componentType,
      NOT_FOUND,
      `ComponentType with id ${component.typeId} not found`,
    );
    await validateComponentPropertyValues(componentType, propertyValues || {});

    const updatedComponent = await prismaClient.component.update({
      where: { id: Number(id) },
      data: {
        typeId: componentType.id,
        feedId: component.feedId,
        order,
        name,
        propertyValues: propertyValues as Prisma.InputJsonValue,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      },
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
    });
    throwError(component, NOT_FOUND, `Component with id ${id} not found`);

    if (typeof propertyValues === "object" && propertyValues !== null) {
      const componentType = await prismaClient.componentType.findUnique({
        where: { id: component.typeId },
      });
      throwError(
        componentType,
        NOT_FOUND,
        `ComponentType with id ${component.typeId} not found`,
      );
      await validateComponentPropertyValues(componentType, propertyValues);
    }

    const updatedComponent = await prismaClient.component.update({
      where: { id: Number(id) },
      data: {
        name,
        order,
        propertyValues: propertyValues as Prisma.InputJsonValue,
        publishedAt,
        expiredAt,
      },
    });

    res.status(OK).json({ component: updatedComponent });
  },
);

export const deleteComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

const componentApi = {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
};
export default componentApi;
