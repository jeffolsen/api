import { NextFunction, Request, RequestHandler, Response } from "express";
import { BAD_REQUEST, NOT_FOUND, OK } from "@config/errorCodes";
import catchErrors from "@util/catchErrors";
import throwError from "@util/throwError";
import prismaClient from "@db/client";
import {
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
  AddItemTagByIdSchema,
} from "@schemas/item";
import {
  MESSAGE_ITEM_NOT_FOUND,
  MESSAGE_TAGS_NOT_FOUND,
} from "@config/errorMessages";

export const getItemTags: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId } = GetItemsResourcesSchema.parse(req.params);

    const item = await prismaClient.item.findUnique({
      where: {
        id: itemId,
        OR: [{ authorId: profileId }, { isPrivate: false }], // can view non-private items
      },
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const tags = await prismaClient.tag.findMany({
      where: { items: { some: { itemId } } },
    });

    res.status(OK).send({ tags });
  },
);

export const getItemTagById: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findUnique({
      where: {
        id: itemId,
        OR: [{ authorId: profileId }, { isPrivate: false }], // can view non-private items
      },
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const tag = await prismaClient.tag.findUnique({
      where: { id, items: { some: { itemId } } },
    });
    throwError(tag, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

    res.status(OK).send({ tag });
  },
);

type AddItemTagBody = {
  id?: number;
  name?: string;
};

export const addItemTag: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { id, name, itemId } = AddItemTagByIdSchema.parse({
      ...req.params,
      ...req.body,
    });

    throwError(id || name, BAD_REQUEST, "Tag name or ID is required");

    await prismaClient.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: itemId, authorId: profileId }, // cannot edit non-private items
        include: { tags: true },
      });
      throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

      const tag = await tx.tag.findUnique({
        where: {
          ...(id ? { id } : { name }),
        },
      });
      throwError(tag, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

      const tagAlreadyOwnedByItem = item.tags.find((i) => i.tagId === tag.id);
      throwError(!tagAlreadyOwnedByItem, BAD_REQUEST, "Item already has tag");

      await tx.item.update({
        where: { id: item.id },
        data: { tags: { create: { tagId: tag.id } } },
      });
    });

    res.sendStatus(OK);
  },
);

export const deleteItemTag: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId }, // cannot edit non-private items
      include: { tags: true },
    });

    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const itemTag = item.tags.find((tag) => tag.tagId === id);
    throwError(itemTag, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

    await prismaClient.item.update({
      where: { id: itemId },
      data: {
        tags: {
          disconnect: { itemId_tagId: { itemId, tagId: id } },
        },
      },
    });

    res.sendStatus(OK);
  },
);

const itemTagApi = {
  getItemTags,
  getItemTagById,
  addItemTag,
  deleteItemTag,
};
export default itemTagApi;
