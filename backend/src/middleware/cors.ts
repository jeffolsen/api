import { Request } from "express";
import { verifyRefreshToken } from "../util/jwt";
import { API_KEY_PUBLIC_ENDPOINT, AUTH_ROUTES } from "../config/constants";
import { CorsOptions } from "cors";
import env from "../config/env";

const dynamicCors = async (
  req: Request,
  callback: (err: Error | null, options: CorsOptions) => void,
) => {
  let dynamicOptions;
  try {
    if (req.path === AUTH_ROUTES + API_KEY_PUBLIC_ENDPOINT) {
      dynamicOptions = { origin: "*" };
    } else {
      const payload = await verifyRefreshToken(req.cookies.refreshToken || "");

      if (payload?.origin) dynamicOptions = { origin: payload.origin };
      else dynamicOptions = { origin: env.ORIGIN };
    }
  } catch (error) {
    dynamicOptions = { origin: env.ORIGIN };
  }
  callback(null, dynamicOptions);
};

export default dynamicCors;
