import { NextFunction, Request, RequestHandler, Response } from "express";
import { NOT_FOUND, OK } from "../config/constants";
import catchErrors from "../util/catchErrors";
import throwError from "../util/throwError";
import prismaClient from "../db/client";
import {
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
} from "../schemas/item";

export interface GetItemTagsParams {
  id: string;
}

export const getItemTags: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId: id } = GetItemsResourcesSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id, authorId: profileId },
      include: { tags: true },
    });

    throwError(item, NOT_FOUND, "item not found");

    res.status(OK).send(item.tags);
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

    const tag = item.tags.find((tag) => tag.id === id);
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
    });

    throwError(item, NOT_FOUND, "item not found");

    await prismaClient.item.update({
      where: { id: itemId },
      data: {
        tags: {
          disconnect: { id },
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
