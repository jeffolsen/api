import { RequestHandler, Request } from "express";

const catchErrors =
  (
    handler: RequestHandler,
  ): RequestHandler<unknown, unknown, unknown, unknown> =>
  async (req, res, next) => {
    try {
      await handler(req as Request, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchErrors;
