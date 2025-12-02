import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { splitScopes } from "../util/scope";
import { UNAUTHORIZED } from "../config/constants";
import throwError from "../util/throwError";

type ScopeParams = string[];

const authorizeScope = (requiredScopes: ScopeParams) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestScope = splitScopes(req.scope);
    const hasScope = requestScope.some((s: string) =>
      requiredScopes.includes(s)
    );
    throwError(hasScope, UNAUTHORIZED, "Unauthorized");

    next();
  };
};

export default authorizeScope;
