import { Request, RequestHandler, Response } from "express";
import { BAD_REQUEST, NOT_FOUND, OK } from "@config/errorCodes";
import catchErrors from "@util/catchErrors";
import throwError from "@util/throwError";
import prismaClient from "@db/client";
import {
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
  AddItemImageByIdSchema,
} from "@schemas/item";
import {
  MESSAGE_ITEM_NOT_FOUND,
  MESSAGE_IMAGES_NOT_FOUND,
} from "@config/errorMessages";

type GetItemImagesParams = {
  itemId: number;
};

export const getItemImages: RequestHandler = catchErrors(
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

    const images = await prismaClient.image.findMany({
      where: { items: { some: { itemId } } },
    });
    throwError(images, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

    res.status(OK).send({ images });
  },
);

type GetItemImageByIdParams = {
  itemId: number;
  id: number;
};

export const getItemImageById: RequestHandler = catchErrors(
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

    const image = await prismaClient.image.findUnique({
      where: { id, items: { some: { itemId } } },
    });
    throwError(image, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

    res.status(OK).send({ image });
  },
);

type AddItemImageParams = {
  itemId: number;
};

type AddItemImageBody = {
  id?: number;
  url?: string;
};

export const addItemImage: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { id, url, itemId } = AddItemImageByIdSchema.parse({
      ...req.params,
      ...req.body,
    });

    throwError(id || url, BAD_REQUEST, "Image url or ID is required");

    await prismaClient.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: itemId, authorId: profileId }, // cannot edit non-private items
        include: { images: true },
      });
      throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

      const image = await tx.image.findUnique({
        where: {
          ...(id ? { id } : { url }),
        },
      });
      throwError(image, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

      const imageAlreadyOwnedByItem = item.images.find(
        (i) => i.imageId === image.id,
      );
      throwError(
        !imageAlreadyOwnedByItem,
        BAD_REQUEST,
        "Item already has image",
      );

      await tx.item.update({
        where: { id: item.id },
        data: { images: { create: { imageId: image.id } } },
      });
    });

    res.sendStatus(OK);
  },
);

type DeleteItemImageParams = {
  itemId: number;
  id: number;
};

export const deleteItemImage: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    await prismaClient.$transaction(async (tx) => {
      const item = await tx.item.findFirst({
        where: { id: itemId, authorId: profileId }, // cannot edit non-private items
        include: { images: true },
      });

      throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

      const itemImage = item.images.find((image) => image.imageId === id);
      throwError(itemImage, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);

      await tx.item.update({
        where: { id: itemId },
        data: {
          images: {
            disconnect: { itemId_imageId: { itemId, imageId: id } },
          },
        },
      });
    });

    res.sendStatus(OK);
  },
);

const itemImageApi = {
  getItemImages,
  getItemImageById,
  addItemImage,
  deleteItemImage,
};
export default itemImageApi;
