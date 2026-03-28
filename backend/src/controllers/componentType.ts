import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient from "../db/client";
import { OK } from "../config/errorCodes";

export const getAllComponentTypes: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const componentTypes = await prismaClient.componentType.findMany();
    res.status(OK).json({ componentTypes });
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
  getComponentTypeByName,
};
export default componentTypeApi;
