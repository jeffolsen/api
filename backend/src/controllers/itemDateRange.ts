import { NextFunction, Request, RequestHandler, Response } from "express";
import { NOT_FOUND, OK } from "../config/errorCodes";
import catchErrors from "../util/catchErrors";
import throwError from "../util/throwError";
import prismaClient from "../db/client";
import {
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
} from "../schemas/item";
import itemImageApi from "./itemImage";

export const getItemDateRanges: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    console.log(
      "Received request to get item date ranges with params:",
      req.params,
    );
    const { itemId: id } = GetItemsResourcesSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id, authorId: profileId },
      include: { dateRanges: true },
    });

    throwError(item, NOT_FOUND, "item not found");
    const dateRanges = await prismaClient.dateRange.findMany({
      where: {
        id: { in: item.dateRanges.map((dateRange) => dateRange.id) },
      },
    });
    throwError(dateRanges, NOT_FOUND, "date ranges not found");

    res.status(OK).send(dateRanges);
  },
);

export const getItemDateRangeById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId },
      include: { dateRanges: true },
    });

    throwError(item, NOT_FOUND, "item not found");

    const dateRange = item.dateRanges.find((dr) => dr.id === id);
    throwError(dateRange, NOT_FOUND, "date range not found");

    res.status(OK).send(dateRange);
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
    throwError(item, NOT_FOUND, "item not found");

    const dateRange = item.dateRanges.find((dr) => dr.id === id);
    throwError(dateRange, NOT_FOUND, "date range not found");

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
