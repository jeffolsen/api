import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, NOT_FOUND, OK } from "../config/constants";
import prismaClient, { TagName } from "../db/client";
import throwError from "../util/throwError";
import { CreateItemSchema } from "../schemas/item";

export const getAllItems: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const items = await prismaClient.item.findMany();

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

    const item = await prismaClient.item.findUnique({
      where: { id: numericId },
      omit: { authorId: true },
    });
    throwError(item, NOT_FOUND, "item not found");

    res.status(OK).json(item);
  },
);

interface CreateItemBody {
  name: string;
  description: string;
  private: boolean;
  tags: TagName[];
  images: number[];
  dateRanges: {
    startAt: string;
    endAt: string;
    description: string;
  }[];
}

export const createItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { name, description, sortName, tags, imageIds, dateRanges } =
      CreateItemSchema.parse({
        ...(req.body as CreateItemBody),
      });

    const existingTags = await prismaClient.tag.findMany({
      where: { name: { in: tags } },
    });
    const tagIds = existingTags.map(({ id }) => {
      return { id };
    });

    const item = await prismaClient.item.create({
      data: {
        name,
        description,
        sortName,
        tags: { connect: tagIds },
        images: {
          create: imageIds.map((imageId) => ({ imageId })),
        },
        dateRanges: { create: [] },
        authorId: profileId,
        isPrivate: true,
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
