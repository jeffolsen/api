import { Request, Response, NextFunction, RequestHandler } from "express";
import { MESSAGE_IMAGE_NOT_FOUND } from "../config/errorMessages";
import { NOT_FOUND, OK } from "../config/errorCodes";
import catchErrors from "../util/catchErrors";
import throwError from "../util/throwError";
import prismaClient, { ImageType } from "../db/client";

type ImageQuery = {
  take?: number;
  skip?: number;
  url?: string;
  type?: string;
  order?: "asc" | "desc";
};
export const getAllImages: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { take, skip, url, type, order } = req.query as ImageQuery;

    const imageType = type ? (type.toUpperCase() as ImageType) : undefined;

    const images = await prismaClient.image.findMany({
      orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
      where: url
        ? {
            url: { contains: url as string, mode: "insensitive" },
          }
        : type
          ? {
              type: imageType,
            }
          : {},

      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });

    res.status(OK).json(images);
  },
);

export const getImageById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params || {};
    const image = await prismaClient.image.findUnique({
      where: { id: Number(id) },
    });
    throwError(image, NOT_FOUND, MESSAGE_IMAGE_NOT_FOUND);
    res.status(OK).json(image);
  },
);

// no create/update/delete since images are only added via seeding for now, and are not editable by users. If we add user-uploaded images in the future, we can add these endpoints then.

const imageApi = {
  getAllImages,
  getImageById,
};
export default imageApi;
