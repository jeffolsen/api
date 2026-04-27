import { Request, Response, RequestHandler } from "express";
import { MESSAGE_IMAGES_NOT_FOUND } from "@config/errorMessages";
import { NOT_FOUND, OK } from "@config/errorCodes";
import catchErrors from "@util/catchErrors";
import throwError from "@util/throwError";
import prismaClient, { ImageType } from "@db/client";
import { GetAllImagesQuerySchema } from "@schemas/image";
import { getSortOrders, getPagination } from "@util/misc";

type ImageQuery = {
  type?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};
export const getAllImages: RequestHandler<
  unknown,
  unknown,
  unknown,
  ImageQuery
> = catchErrors(async (req: Request, res: Response) => {
  const { type, sort, page, pageSize } = GetAllImagesQuerySchema.parse(
    req.query,
  );

  const images = await prismaClient.image.findMany({
    where: type
      ? {
          type: type,
        }
      : undefined,
    ...getSortOrders(sort),
    ...getPagination(page, pageSize),
  });

  res.status(OK).json({ images });
});

export const getImageById: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params || {};
    const image = await prismaClient.image.findUnique({
      where: { id: Number(id) },
    });
    throwError(image, NOT_FOUND, MESSAGE_IMAGES_NOT_FOUND);
    res.status(OK).json({ image });
  },
);

// no create/update/delete since images are only added via seeding for now, and are not editable by users. If we add user-uploaded images in the future, we can add these endpoints then.

const imageApi = {
  getAllImages,
  getImageById,
};
export default imageApi;
