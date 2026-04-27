import { NextFunction, Request, RequestHandler, Response } from "express";
import { NOT_FOUND, OK } from "../../config/errorCodes";
import catchErrors from "../../util/catchErrors";
import throwError from "../../util/throwError";
import prismaClient from "../../db/client";
import {
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
} from "../../schemas/item";
import {
  MESSAGE_ITEM_NOT_FOUND,
  MESSAGE_TAGS_NOT_FOUND,
} from "../../config/errorMessages";

export const getItemTags: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId } = GetItemsResourcesSchema.parse(req.params);

    const tags = await prismaClient.tag.findMany({
      where: { items: { some: { itemId } } },
    });
    throwError(tags, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

    res.status(OK).send({ tags });
  },
);

export const getItemTagById: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const tag = await prismaClient.tag.findUnique({
      where: { id, items: { some: { itemId } } },
    });
    throwError(tag, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

    res.status(OK).send({ tag });
  },
);

export const deleteItemTag: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId },
      include: { tags: true },
    });

    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const itemTag = item.tags.find((tag) => tag.tagId === id);
    throwError(itemTag, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

    const tag = await prismaClient.tag.findUnique({
      where: { id: itemTag.tagId },
    });
    throwError(tag, NOT_FOUND, MESSAGE_TAGS_NOT_FOUND);

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
  deleteItemTag,
};
export default itemTagApi;
