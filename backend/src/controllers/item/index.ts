import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient, { Prisma } from "@db/client";
import catchErrors from "@util/catchErrors";
import throwError from "@util/throwError";
import { NOT_FOUND, OK, NO_CONTENT, BAD_REQUEST } from "@config/errorCodes";
import { MESSAGE_ITEM_NOT_FOUND } from "@config/errorMessages";
import { getPagination, getSortOrders } from "@util/misc";
import {
  CreateItemSchema,
  GetAllItemsQuerySchema,
  GetItemByIdSchema,
  ModifyItemSchema,
} from "@schemas/item";

type GetItemsQuery = {
  privateOnly?: boolean;
  searchName?: string;
  tags?: string;
  ids?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export const getAllItems: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetItemsQuery
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const { ids, tags, sort, page, pageSize, searchName, privateOnly } =
    GetAllItemsQuerySchema.parse(req.query);

  const where = {
    ...(privateOnly
      ? {
          authorId: profileId,
        }
      : { OR: [{ isPrivate: false }, { authorId: profileId }] }),
    ...(ids.length && {
      id: { in: ids },
    }),
    ...(searchName && {
      name: {
        contains: searchName,
        mode: "insensitive",
      },
    }),
    ...(tags.length && {
      tags: {
        some: {
          tag: {
            name: { in: tags },
          },
        },
      },
    }),
  } as Prisma.ItemWhereInput;

  const [items, totalCount] = await prismaClient.$transaction([
    prismaClient.item.findMany({
      where,
      ...getSortOrders(sort),
      ...getPagination(page, pageSize),
    }),
    prismaClient.item.count({ where }),
  ]);

  res.status(OK).json({ items, totalCount });
});

export const getItemById: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { include, id } = GetItemByIdSchema.parse({
      ...req.query,
      ...req.params,
    });

    const item = await prismaClient.item.findUnique({
      where: { id, OR: [{ isPrivate: false }, { authorId: profileId }] },
      include,
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    res.status(OK).json({ item });
  },
);

interface CreateItemBody {
  name: string;
  description?: string;
  tagNames?: string[];
  images?: number[];
  overrideLink?: string;
  publishedAt?: string;
  expiredAt?: string;
  dateRanges?: {
    startAt: string;
    endAt: string;
    description: string;
  }[];
}

export const createItem: RequestHandler<
  unknown,
  unknown,
  CreateItemBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const {
    name,
    description,
    sortName,
    overrideLink,
    tagNames,
    imageIds,
    dateRanges,
    publishedAt,
    expiredAt,
  } = CreateItemSchema.parse({
    ...req.body,
  });

  const feed =
    overrideLink &&
    (await prismaClient.feed.findFirst({
      where: {
        profileId,
        path: overrideLink,
      },
    }));

  const doesntNeedALink = !overrideLink;
  const foundALink = overrideLink && feed;

  throwError(doesntNeedALink || foundALink, BAD_REQUEST, "Link not allowed");

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
      overrideLink,
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
  });

  res.status(OK).send({ item });
});

export const updateItem: RequestHandler<
  unknown,
  unknown,
  CreateItemBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const { id } = req.params || {};
  const {
    name,
    description,
    sortName,
    overrideLink,
    tagNames,
    imageIds,
    dateRanges,
    publishedAt,
    expiredAt,
  } = CreateItemSchema.parse(req.body);

  const item = await prismaClient.item.findFirst({
    where: { id: Number(id), authorId: profileId },
  });
  throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

  const feed =
    overrideLink &&
    (await prismaClient.feed.findFirst({
      where: {
        profileId,
        path: overrideLink,
      },
    }));

  const doesntNeedALink = !overrideLink;
  const foundALink = overrideLink && feed;

  throwError(doesntNeedALink || foundALink, BAD_REQUEST, "Link not allowed");

  const tags =
    tagNames &&
    (await prismaClient.tag.findMany({
      where: { name: { in: tagNames } },
    }));

  const updatedItem = await prismaClient.item.update({
    where: { id: Number(id), authorId: profileId },
    data: {
      name,
      description,
      sortName,
      overrideLink,
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
  });

  res.status(OK).send({ item: updatedItem });
});

interface ModifyItemBody {
  name?: string;
  description?: string;
  overridLink?: string;
  publishedAt?: string;
  expiredAt?: string;
}

export const modifyItem: RequestHandler<
  unknown,
  unknown,
  ModifyItemBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const { id } = req.params || {};
  const { overrideLink, ...data } = ModifyItemSchema.parse(req.body);

  const item = await prismaClient.item.findFirst({
    where: { id: Number(id), authorId: profileId },
  });
  throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

  const updatedItem = await prismaClient.item.update({
    where: { id: Number(id), authorId: profileId },
    data: {
      ...data,
      authorId: profileId,
      isPrivate: true,
    },
  });

  res.status(OK).send({ item: updatedItem });
});

export const deleteItem: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { id } = req.params || {};

    const item = await prismaClient.item.findFirst({
      where: { id: Number(id), authorId: profileId },
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    await prismaClient.item.delete({
      where: { id: item.id, authorId: profileId },
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
