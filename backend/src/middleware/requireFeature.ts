import { NextFunction, Request, Response } from "express";
import env from "@config/env";
import { SERVICE_UNAVAILABLE } from "@config/errorCodes";

type FeatureFlag = keyof typeof env;

const requireFeature =
  (flag: FeatureFlag) => (req: Request, res: Response, next: NextFunction) => {
    if (!env[flag]) return res.sendStatus(SERVICE_UNAVAILABLE);
    next();
  };

export default requireFeature;
