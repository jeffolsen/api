import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient, { TagName } from "../db/client";
import catchErrors from "../util/catchErrors";
import throwError from "../util/throwError";
import { NOT_FOUND, OK, NO_CONTENT } from "../config/errorCodes";
import { MESSAGE_ITEM_NOT_FOUND } from "../config/errorMessages";
import { getPagination, getSortOrders } from "../util/misc";
import {
  CreateItemSchema,
  GetAllItemsQuerySchema,
  GetItemByIdSchema,
  ModifyItemSchema,
} from "../schemas/item";

type GetItemsQuery = {
  tags?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export const getAllItems: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { tags, sort, page, pageSize } = GetAllItemsQuerySchema.parse(
      req.query as GetItemsQuery,
    );

    const where = {
      authorId: profileId,
      ...(tags.length && {
        tags: {
          some: {
            tag: {
              name: { in: tags },
            },
          },
        },
      }),
    } as const;

    const [items, totalCount] = await prismaClient.$transaction([
      prismaClient.item.findMany({
        where,
        ...getSortOrders(sort),
        ...getPagination(page, pageSize),
        omit: { authorId: true },
      }),
      prismaClient.item.count({ where }),
    ]);

    res.status(OK).json({ items, totalCount });
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
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    res.status(OK).json({ item });
  },
);

interface CreateItemBody {
  name: string;
  description: string;
  tagNames: TagName[];
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
      tagNames,
      imageIds,
      dateRanges,
      publishedAt,
      expiredAt,
    } = CreateItemSchema.parse({
      ...(req.body as CreateItemBody),
    });

    const tags =
      tagNames &&
      (await prismaClient.tag.findMany({
        where: { name: { in: tagNames } },
      }));

    const item = await prismaClient.item.create({
      data: {
        name,
        description,
        sortName,
        publishedAt,
        expiredAt,
        tags: {
          create: tags.map(({ id }) => ({ tagId: id })),
        },
        images: {
          create: imageIds.map((imageId) => ({ imageId })),
        },
        dateRanges: {
          create: dateRanges,
        },
        authorId: profileId,
        isPrivate: true,
      },
      omit: { authorId: true },
    });

    res.status(OK).send({ item });
  },
);

export const updateItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    const {
      name,
      description,
      sortName,
      tagNames,
      imageIds,
      dateRanges,
      publishedAt,
      expiredAt,
    } = CreateItemSchema.parse(req.body as CreateItemBody);

    const item = await prismaClient.item.findFirst({
      where: { id: Number(id), authorId: profileId },
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const tags =
      tagNames &&
      (await prismaClient.tag.findMany({
        where: { name: { in: tagNames } },
      }));

    const updatedItem = await prismaClient.item.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        sortName,
        publishedAt,
        expiredAt,
        tags: {
          deleteMany: {},
          create: tags.map(({ id }) => ({ tagId: id })),
        },
        images: {
          deleteMany: {},
          create: imageIds.map((imageId) => ({ imageId })),
        },
        dateRanges: {
          deleteMany: {},
          create: dateRanges,
        },
        authorId: profileId,
        isPrivate: true,
      },
      omit: { authorId: true },
    });

    res.status(OK).send({ item: updatedItem });
  },
);

interface ModifyItemBody {
  name?: string;
  description?: string;
  publishedAt?: string;
  expiredAt?: string;
}

export const modifyItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    const data = ModifyItemSchema.parse(req.body as Partial<ModifyItemBody>);

    const item = await prismaClient.item.findFirst({
      where: { id: Number(id), authorId: profileId },
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const updatedItem = await prismaClient.item.update({
      where: { id: Number(id) },
      data,
      omit: { authorId: true },
    });

    res.status(OK).send({ item: updatedItem });
  },
);

export const deleteItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};

    const item = await prismaClient.item.findFirst({
      where: { id: Number(id), authorId: profileId },
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    await prismaClient.item.delete({
      where: { id: item.id },
    });
    res.sendStatus(NO_CONTENT);
  },
);

const itemApi = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  modifyItem,
  deleteItem,
};
export default itemApi;
