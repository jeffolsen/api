import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";

export const endPointNotFound = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(createHttpError(404, "Endpoint not found"));
};

const handleError: ErrorRequestHandler = async (error, req, res, next) => {
  let message = "unknown error";
  let status = 500;
  if (isHttpError(error)) {
    status = error.status;
    message = error.message;
  }
  res.status(status).json({ message });
};
export default handleError;
