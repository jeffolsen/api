import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/constants";

export const getAllItems: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { tags } = req.body || {};
    res.sendStatus(OK);
  },
);

export const getItemById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

export const createItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    res.sendStatus(OK);
  },
);

export const updateItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

export const deleteItem: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

const itemApi = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
export default itemApi;
