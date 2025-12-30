import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/constants";

export const getAllComponents: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    res.sendStatus(OK);
  },
);

export const getComponentById: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

export const createComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    res.sendStatus(OK);
  },
);

export const updateComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

export const deleteComponent: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;
    const { id } = req.params || {};
    res.sendStatus(OK);
  },
);

const componentApi = {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
};
export default componentApi;
