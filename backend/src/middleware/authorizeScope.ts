import { NextFunction, Request, Response } from "express";
import { parseScopeString } from "../util/scope";
import { UNAUTHORIZED } from "../config/constants";
import throwError from "../util/throwError";

type ScopeParams = string[];

const authorizeScope = (requiredScopes: ScopeParams) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestScope = parseScopeString(req.scope);
    console.log(`USING SCOPE: ${req.scope} TO ACCESS PATH: ${req.path}`);
    const hasScope = requestScope.some((s: string) =>
      requiredScopes.includes(s)
    );
    throwError(hasScope, UNAUTHORIZED, "Unauthorized");

    next();
  };
};

export default authorizeScope;
