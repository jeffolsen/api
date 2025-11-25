import { RequestHandler } from "express";

const catchErrors =
  (handler: RequestHandler): RequestHandler<any, any, any, any> =>
  async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchErrors;
