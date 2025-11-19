import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { splitScopes } from "../services/scope";

type ScopeProps = string[];

const authorizeScope = (requiredScopes: ScopeProps) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestScope = splitScopes(req.body.scope);
      const hasScope = requestScope.some((s: string) =>
        requiredScopes.includes(s)
      );
      if (!hasScope) throw createHttpError(401, "Unauthorized");

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeScope;
