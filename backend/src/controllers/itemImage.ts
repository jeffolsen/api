import { NextFunction, Request, RequestHandler, Response } from "express";
import { NOT_FOUND, OK } from "../config/errorCodes";
import catchErrors from "../util/catchErrors";
import throwError from "../util/throwError";
import prismaClient from "../db/client";
import {
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
} from "../schemas/item";
import {
  MESSAGE_ITEM_NOT_FOUND,
  MESSAGE_IMAGES_NOT_FOUND,
} from "../config/errorMessages";

export const getItemImages: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId: id } = GetItemsResourcesSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id, authorId: profileId },
      include: { images: true },
    });

    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);
    const images = await prismaClient.image.findMany({
      where: { id: { in: item.images.map((image) => image.imageId) } },
    });
    throwError(images, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

    res.status(OK).send(images);
  },
);

export const getItemImageById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId },
      include: { images: true },
    });

    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const itemImage = item.images.find((image) => image.imageId === id);
    throwError(itemImage, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

    const image = await prismaClient.image.findUnique({
      where: { id: itemImage.imageId },
    });
    throwError(image, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

    res.status(OK).send(image);
  },
);

export const deleteItemImage: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId },
      include: { images: true },
    });

    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const itemImage = item.images.find((image) => image.imageId === id);
    throwError(itemImage, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

    await prismaClient.item.update({
      where: { id: itemId },
      data: {
        images: {
          disconnect: { itemId_imageId: { itemId, imageId: id } },
        },
      },
    });

    res.sendStatus(OK);
  },
);

const itemImageApi = {
  getItemImages,
  getItemImageById,
  deleteItemImage,
};
export default itemImageApi;
