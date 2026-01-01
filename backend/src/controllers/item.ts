import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, NOT_FOUND, OK } from "../config/constants";
import prismaClient from "../db/client";
import throwError from "../util/throwError";
import { isTagArray } from "../util/array";

export const getAllItems: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const items = prismaClient.item.findMany();

    res.status(OK).json(items);
  },
);

export const getItemById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    const numericId = parseInt(id);
    throwError(
      typeof numericId === "number",
      BAD_REQUEST,
      "ID should be a number",
    );

    const item = prismaClient.item.findUnique({
      where: { id: numericId },
      omit: { authorId: true },
    });
    throwError(item, NOT_FOUND, "item not found");

    res.status(OK).json(item);
  },
);

export const createItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { title, subtitle, content, tags } = req.body || {};
    throwError(title && content, BAD_REQUEST, "Title and content are required");
    throwError(!tags || isTagArray(tags), BAD_REQUEST, "Invalid tags");

    const existingTags = await prismaClient.tag.findMany({
      where: { name: { in: tags } },
    });
    const tagIds = existingTags.map(({ id }) => {
      return { id };
    });

    const item = await prismaClient.item.create({
      data: {
        title,
        content,
        subtitle,
        tags: { connect: tagIds },
      },
      omit: { authorId: true },
    });

    res.status(OK).send(item);
  },
);

export const updateItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

export const deleteItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

const itemApi = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
export default itemApi;
