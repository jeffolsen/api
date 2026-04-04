import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient, { type Prisma } from "../db/client";
import { NOT_FOUND, OK } from "../config/errorCodes";
import throwError from "../util/throwError";
import { CreateComponentSchema } from "../schemas/component";
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

type CreateComponentBody = {
  feedId: number;
  typeId: number;
  order: number;
  name: string;
  propertyValues?: Record<string, unknown>;
  publishedAt?: string;
  expiredAt?: string;
};

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

export const updateComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    const {
      feedId,
      typeId,
      order,
      name,
      propertyValues,
      publishedAt,
      expiredAt,
    } = CreateComponentSchema.parse(req.body as CreateComponentBody);

    const component = await prismaClient.component.findUnique({
      where: { id: Number(id), feed: { profileId } },
    });
    throwError(component, NOT_FOUND, `Component with id ${id} not found`);

    const componentType = await prismaClient.componentType.findUnique({
      where: { id: typeId },
    });
    throwError(
      componentType,
      NOT_FOUND,
      `ComponentType with id ${typeId} not found`,
    );
    await validateComponentPropertyValues(componentType, propertyValues || {});

    const updatedComponent = await prismaClient.component.update({
      where: { id: Number(id) },
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
