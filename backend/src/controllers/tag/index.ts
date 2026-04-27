import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "@util/catchErrors";
import { OK } from "@config/errorCodes";
import prismaClient from "@db/client";

export const getAllTags: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const tags = await prismaClient.tag.findMany({
      select: { name: true },
      orderBy: { name: "desc" },
    });
    res.status(OK).json({ tags });
  },
);

const tagApi = {
  getAllTags,
};
export default tagApi;
