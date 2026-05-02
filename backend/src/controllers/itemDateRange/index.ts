import { NextFunction, Request, RequestHandler, Response } from "express";
import { BAD_REQUEST, NOT_FOUND, OK } from "@config/errorCodes";
import catchErrors from "@util/catchErrors";
import throwError from "@util/throwError";
import prismaClient from "@db/client";
import {
  AddItemDateRangeByIdSchema,
  GetItemResourceByIdSchema,
  GetItemsResourcesSchema,
} from "@schemas/item";
import {
  MESSAGE_ITEM_NOT_FOUND,
  MESSAGE_DATE_RANGES_NOT_FOUND,
} from "@config/errorMessages";
import { getDateRangeSlug } from "@/services/item";

export const getItemDateRanges: RequestHandler = catchErrors(
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

    const dateRanges = await prismaClient.dateRange.findMany({
      where: { itemId },
    });
    throwError(dateRanges, NOT_FOUND, MESSAGE_DATE_RANGES_NOT_FOUND);

    res.status(OK).send({ dateRanges });
  },
);

export const getItemDateRangeById: RequestHandler = catchErrors(
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

    const dateRange = await prismaClient.dateRange.findUnique({
      where: { id, itemId },
    });
    throwError(dateRange, NOT_FOUND, MESSAGE_DATE_RANGES_NOT_FOUND);

    res.status(OK).send({ dateRange });
  },
);

type AddItemDateRangeBody = {
  description?: string;
  startAt: string;
  endAt: string;
};

export const addItemDateRange: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId, description, startAt, endAt } =
      AddItemDateRangeByIdSchema.parse({
        ...req.params,
        ...req.body,
      });

    await prismaClient.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: itemId, authorId: profileId }, // cannot edit non-private items
        include: { dateRanges: true },
      });
      throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);

      await tx.item.update({
        where: { id: item.id },
        data: {
          dateRanges: {
            create: {
              description,
              startAt,
              endAt,
              slug: getDateRangeSlug(item.sortName, item.dateRanges.length),
            },
          },
        },
      });
    });

    res.sendStatus(OK);
  },
);

export const deleteItemDateRange: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { itemId, id } = GetItemResourceByIdSchema.parse(req.params);

    const item = await prismaClient.item.findFirst({
      where: { id: itemId, authorId: profileId }, // cannot edit non-private items
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
  addItemDateRange,
  deleteItemDateRange,
};
export default itemDateRangeApi;
