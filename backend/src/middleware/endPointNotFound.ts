import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NOT_FOUND } from "../config/constants";

export const endPointNotFound = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(createHttpError(NOT_FOUND, "Endpoint not found"));
};

export default endPointNotFound;
