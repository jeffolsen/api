import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { splitScopes } from "../util/scope";

type ScopeParams = string[];

const authorizeScope = (requiredScopes: ScopeParams) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestScope = splitScopes(req.scope);
    const hasScope = requestScope.some((s: string) =>
      requiredScopes.includes(s)
    );
    if (!hasScope) throw createHttpError(401, "Unauthorized");

    next();
  };
};

export default authorizeScope;
