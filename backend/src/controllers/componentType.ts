import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient from "../db/client";
import { OK } from "../config/errorCodes";
import { GetAllComponentTypesQuerySchema } from "../schemas/componentType";

type GetComponentTypesQuery = {
  subjectType?: string;
};

export const getAllComponentTypes: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { subjectType } = GetAllComponentTypesQuerySchema.parse(
      req.query as GetComponentTypesQuery,
    );
    const componentTypes = await prismaClient.componentType.findMany({
      ...(subjectType && {
        where: {
          subjectType: { equals: subjectType },
        },
      }),
    });
    res.status(OK).json({ componentTypes });
  },
);

export const getComponentTypeById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params || {};
    const componentType = await prismaClient.componentType.findUnique({
      where: { id: Number(id) },
    });
    res.status(OK).json({ componentType });
  },
);

export const getComponentTypeByName: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params || {};
    const componentType = await prismaClient.componentType.findUnique({
      where: { name },
    });
    res.status(OK).json({ componentType });
  },
);

const componentTypeApi = {
  getAllComponentTypes,
  getComponentTypeById,
  getComponentTypeByName,
};
export default componentTypeApi;
