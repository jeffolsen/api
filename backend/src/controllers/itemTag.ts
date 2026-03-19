import { NextFunction, Request, RequestHandler, Response } from "express";
import { NOT_FOUND, OK } from "../config/errorCodes";
import catchErrors from "../util/catchErrors";
import throwError from "../util/throwError";
import prismaClient from "../db/client";
import {
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
} from "../schemas/item";

export const getItemTags: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId: id } = GetItemsResourcesSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id, authorId: profileId },
      include: { tags: true },
    });

    throwError(item, NOT_FOUND, "item not found");
    const tags = await prismaClient.tag.findMany({
      where: { id: { in: item.tags.map((tag) => tag.tagId) } },
    });
    throwError(tags, NOT_FOUND, "tags not found");

    res.status(OK).send(tags);
  },
);

export const getItemTagById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId },
      include: { tags: true },
    });

    throwError(item, NOT_FOUND, "item not found");

    const itemTag = item.tags.find((tag) => tag.tagId === id);
    throwError(itemTag, NOT_FOUND, "tag not found");

    const tag = await prismaClient.tag.findUnique({
      where: { id: itemTag.tagId },
    });
    throwError(tag, NOT_FOUND, "tag not found");

    res.status(OK).send(tag);
  },
);

export const deleteItemTag: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId },
      include: { tags: true },
    });

    throwError(item, NOT_FOUND, "item not found");

    const itemTag = item.tags.find((tag) => tag.tagId === id);
    throwError(itemTag, NOT_FOUND, "tag not found");

    const tag = await prismaClient.tag.findUnique({
      where: { id: itemTag.tagId },
    });
    throwError(tag, NOT_FOUND, "tag not found");

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
