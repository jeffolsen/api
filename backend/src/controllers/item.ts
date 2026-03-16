import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { NOT_FOUND, OK } from "../config/constants";
import prismaClient, { TagName } from "../db/client";
import throwError from "../util/throwError";
import {
  CreateItemSchema,
  GetAllItemsQuerySchema,
  GetItemByIdSchema,
} from "../schemas/item";

export const getAllItems: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { tags, sort } = GetAllItemsQuerySchema.parse(req.query);

    const items = await prismaClient.item.findMany({
      where: {
        authorId: profileId,
        tags: tags
          ? {
              some: {
                name: { in: Array.isArray(tags) ? tags : [tags] },
              },
            }
          : undefined,
      },
      orderBy: sort.map((sort: string) => {
        if (sort.startsWith("-")) {
          return { [sort.slice(1)]: "desc" };
        }
        return { [sort]: "asc" };
      }) || [{ publishedAt: "desc" }],
      omit: { authorId: true },
    });

    res.status(OK).json(items);
  },
);

export const getItemById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { include, id } = GetItemByIdSchema.parse({
      ...(req.query as Record<string, unknown>),
      ...req.params,
    });

    const item = await prismaClient.item.findUnique({
      where: { id, authorId: profileId },
      include,
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
  publishedAt: string;
  expiredAt: string;
  dateRanges: {
    startAt: string;
    endAt: string;
    description: string;
  }[];
}

export const createItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const {
      name,
      description,
      sortName,
      tags,
      imageIds,
      dateRanges,
      publishedAt,
      expiredAt,
    } = CreateItemSchema.parse({
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
        publishedAt,
        expiredAt,
        tags: { connect: tagIds },
        images: {
          create: imageIds.map((imageId) => ({ imageId })),
        },
        dateRanges: { create: dateRanges },
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
