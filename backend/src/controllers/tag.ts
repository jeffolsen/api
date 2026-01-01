import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/constants";
import prismaClient from "../db/client";

export const getAllTags: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const tags = prismaClient.tag.findMany({ select: { name: true } });
    res.status(OK).json(tags);
  },
);

export const getTagByName: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params || {};
    res.sendStatus(OK);
  },
);

const tagApi = {
  getAllTags,
  getTagByName,
};
export default tagApi;
