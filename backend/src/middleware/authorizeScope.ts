import { NextFunction, Request, Response } from "express";
import { parseScopeString } from "../util/scope";
import { MESSAGE_NO_ACCESS } from "../config/errorMessages";
import { FORBIDDEN } from "../config/errorCodes";
import throwError from "../util/throwError";

type ScopeParams = string[];

const authorizeScope = (requiredScopes: ScopeParams) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestScope = parseScopeString(req.scope);
    const hasScope = requestScope.some((s: string) =>
      requiredScopes.includes(s),
    );
    throwError(hasScope, FORBIDDEN, MESSAGE_NO_ACCESS);

    next();
  };
};

export default authorizeScope;
