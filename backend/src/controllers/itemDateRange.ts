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
  MESSAGE_DATE_RANGES_NOT_FOUND,
} from "../config/errorMessages";

export const getItemDateRanges: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId } = GetItemsResourcesSchema.parse(req.params);

    const dateRanges = await prismaClient.dateRange.findMany({
      where: { itemId },
    });
    throwError(dateRanges, NOT_FOUND, MESSAGE_DATE_RANGES_NOT_FOUND);

    res.status(OK).send({ dateRanges });
  },
);

export const getItemDateRangeById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const dateRange = await prismaClient.dateRange.findUnique({
      where: { id, itemId },
    });
    throwError(dateRange, NOT_FOUND, MESSAGE_DATE_RANGES_NOT_FOUND);

    res.status(OK).send({ dateRange });
  },
);

export const deleteItemDateRange: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId },
      include: { dateRanges: true },
    });
    throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

    const dateRange = item.dateRanges.find((dr) => dr.id === id);
    throwError(dateRange, NOT_FOUND, MESSAGE_DATE_RANGES_NOT_FOUND);

    await prismaClient.dateRange.delete({
      where: { id: dateRange.id, itemId: item.id },
    });

    res.sendStatus(OK);
  },
);

const itemDateRangeApi = {
  getItemDateRanges,
  getItemDateRangeById,
  deleteItemDateRange,
};
export default itemDateRangeApi;
