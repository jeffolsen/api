// import { Request } from "express";
// import { verifyRefreshToken } from "../util/jwt";
// import { API_KEY_PUBLIC_ENDPOINT, AUTH_ROUTES } from "../config/constants";
// import { CorsOptions } from "cors";
// import env from "../config/env";

// const dynamicCors = async (
//   origin: string | string[] | undefined,
//   callback: (err: Error | null, options: CorsOptions | null) => void,
// ) => {
//   try {
//     if (req.path === AUTH_ROUTES + API_KEY_PUBLIC_ENDPOINT) {
//       const payload = await verifyRefreshToken(req.cookies.refreshToken || "");

//     } else {
//       if (payload?.origin) dynamicOptions = { origin: payload.origin };
//       else dynamicOptions = { origin: env.ORIGIN };
//     }
//   } catch (error) {
//     callback(new Error("Not allowed by CORS"));
//   }
// };

// export default { origin: dynamicCors, credentials: true };
