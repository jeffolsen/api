import { ErrorRequestHandler } from "express";
import { isHttpError } from "http-errors";
import { INTERNAL_SERVER_ERROR } from "../config/constants";

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  console.log(`PATH ${req.path}`, error);
  let message = "internal server error";
  let status = INTERNAL_SERVER_ERROR;

  if (isHttpError(error)) {
    status = error.status;
    message = error.message;
  }
  res.status(status).json({ message });
};
export default errorHandler;
