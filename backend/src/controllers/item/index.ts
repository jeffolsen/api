import { Request, RequestHandler, Response } from "express";
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
import { validateItemExists, validateOverridLink } from "@/services/item";

type GetItemsQuery = {
  privateOnly?: boolean;
  searchName?: string;
  tags?: string;
  ids?: string;
  slugs?: string;
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
  const { ids, slugs, tags, sort, page, pageSize, searchName, privateOnly } =
    GetAllItemsQuerySchema.parse(req.query);

  const where = {
    ...(privateOnly
      ? {
          authorId: profileId,
        }
      : { OR: [{ isPrivate: false }, { authorId: profileId }] }),
    ...(slugs.length && {
      slug: { in: slugs },
    }),
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
  await validateOverridLink({ profileId, overrideLink });

  const item = await prismaClient.$transaction(async (tx) => {
    const tags = tagNames.length
      ? await prismaClient.tag.findMany({
          where: { name: { in: tagNames } },
        })
      : [];

    const lastRecord = await tx.item.findFirst({
      orderBy: { id: "desc" },
    });

    const newId = lastRecord ? lastRecord.id + 1 : 1;
    const slug = `${sortName}-${newId}`;

    return await tx.item.create({
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
        slug: slug,
      },
    });
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

  await validateOverridLink({ profileId, overrideLink });
  await validateItemExists({ profileId, itemId: id });

  const updatedItem = await prismaClient.$transaction(async (tx) => {
    const tags = tagNames.length
      ? await tx.tag.findMany({
          where: { name: { in: tagNames } },
        })
      : [];

    return await tx.item.update({
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
        // authorId is immutable
        // isPrivate is immutable
        // slug is immutable
      },
    });
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
  const { name, sortName, description, overrideLink, publishedAt, expiredAt } =
    ModifyItemSchema.parse(req.body);
  throwError(
    name || sortName || description || overrideLink || publishedAt || expiredAt,
    BAD_REQUEST,
    "Need to update something",
  );

  await validateOverridLink({ profileId, overrideLink });
  await validateItemExists({ profileId, itemId: id });

  const updatedItem = await prismaClient.item.update({
    where: { id: Number(id), authorId: profileId },
    data: {
      ...(name && { name }),
      ...(sortName && { sortName }),
      ...(description && { description }),
      ...(overrideLink && { overrideLink }),
      ...(publishedAt && { publishedAt }),
      ...(expiredAt && { expiredAt }),
      // for now only the above fields can be modified
    },
  });

  res.status(OK).send({ item: updatedItem });
});

export const deleteItem: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { id } = req.params || {};

    await validateItemExists({ profileId, itemId: id });

    await prismaClient.item.delete({
      where: { id: Number(id), authorId: profileId },
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
