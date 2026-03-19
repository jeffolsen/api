import express from "express";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import sessionRoutes from "./routes/session";
import verificationCodeRoutes from "./routes/verificationCode";
import feedRoutes from "./routes/feed";
import tagRoutes from "./routes/tag";
import itemRoutes from "./routes/item";
import itemTagRoutes from "./routes/itemTag";
import itemImageRoutes from "./routes/itemImage";
import itemDateRangeRoutes from "./routes/itemDateRange";
import componentRoutes from "./routes/component";
import apiKeyRoutes from "./routes/apiKey";
import imageRoutes from "./routes/image";
import authenticate from "./middleware/authenticate";
import {
  API_KEY_ROUTES,
  AUTH_ROUTES,
  COMPONENT_ROUTES,
  FEED_ROUTES,
  ITEM_ROUTES,
  PROFILE_ROUTES,
  SESSION_ROUTES,
  TAG_ROUTES,
  VERIFICATION_CODE_ROUTES,
  IMAGE_ROUTES,
} from "./config/routes";

const apiRouter = express.Router();
// auth and profile routes don't require authentication
apiRouter.use(VERIFICATION_CODE_ROUTES, verificationCodeRoutes);
apiRouter.use(AUTH_ROUTES, authRoutes);
apiRouter.use(PROFILE_ROUTES, profileRoutes);
apiRouter.use(API_KEY_ROUTES, apiKeyRoutes);
apiRouter.use(SESSION_ROUTES, sessionRoutes);

apiRouter.use(IMAGE_ROUTES, authenticate, imageRoutes);
apiRouter.use(TAG_ROUTES, authenticate, tagRoutes);

apiRouter.use(ITEM_ROUTES, authenticate, itemRoutes);
apiRouter.use(ITEM_ROUTES, authenticate, itemTagRoutes);
apiRouter.use(ITEM_ROUTES, authenticate, itemImageRoutes);
apiRouter.use(ITEM_ROUTES, authenticate, itemDateRangeRoutes);

apiRouter.use(COMPONENT_ROUTES, authenticate, componentRoutes);
apiRouter.use(FEED_ROUTES, authenticate, feedRoutes);

export default apiRouter;
export { BASE_API_URL } from "./config/routes";
