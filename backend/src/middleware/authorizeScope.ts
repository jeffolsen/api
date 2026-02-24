import { NextFunction, Request, Response } from "express";
import { parseScopeString } from "../util/scope";
import { ERROR_NO_ACCESS, FORBIDDEN } from "../config/constants";
import throwError from "../util/throwError";

type ScopeParams = string[];

const authorizeScope = (requiredScopes: ScopeParams) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestScope = parseScopeString(req.scope);
    const hasScope = requestScope.some((s: string) =>
      requiredScopes.includes(s),
    );
    throwError(hasScope, FORBIDDEN, ERROR_NO_ACCESS);

    next();
  };
};

export default authorizeScope;
