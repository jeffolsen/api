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

export const getItemImages: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    console.log("Received request to get item images with params:", req.params);
    const { itemId: id } = GetItemsResourcesSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id, authorId: profileId },
      include: { images: true },
    });

    throwError(item, NOT_FOUND, "item not found");
    const images = await prismaClient.image.findMany({
      where: { id: { in: item.images.map((image) => image.imageId) } },
    });
    throwError(images, NOT_FOUND, "images not found");

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

    throwError(item, NOT_FOUND, "item not found");

    const itemImage = item.images.find((image) => image.imageId === id);
    throwError(itemImage, NOT_FOUND, "image not found");

    const image = await prismaClient.image.findUnique({
      where: { id: itemImage.imageId },
    });
    throwError(image, NOT_FOUND, "image not found");

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

    throwError(item, NOT_FOUND, "item not found");

    const itemImage = item.images.find((image) => image.imageId === id);
    throwError(itemImage, NOT_FOUND, "image not found");

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
