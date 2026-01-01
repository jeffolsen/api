import { ErrorRequestHandler } from "express";
import { isHttpError } from "http-errors";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../config/constants";
import { z } from "zod";

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  console.log(`PATH ${req.path}`, error);
  let errors = [{ message: "internal server error" }];
  let status = INTERNAL_SERVER_ERROR;

  if (error instanceof z.ZodError) {
    status = BAD_REQUEST;
    errors = JSON.parse(error.message);
  } else if (isHttpError(error)) {
    status = error.status;
    errors = [{ message: error.message }];
  }
  res.status(status).json({ errors });
};
export default errorHandler;
