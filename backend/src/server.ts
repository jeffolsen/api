import env from "./config/env";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import profileRoutes from "./routes/profile";
import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/session";
import verificationCodeRoutes from "./routes/verificationCode";
import feedRoutes from "./routes/feed";
import tagRoutes from "./routes/tag";
import itemRoutes from "./routes/item";
import itemTagRoutes from "./routes/itemTag";
import itemImageRoutes from "./routes/itemImage";
import componentRoutes from "./routes/component";
import apiKeyRoutes from "./routes/apiKey";
import imageRoutes from "./routes/image";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authenticate";
import path from "path";

import {
  BASE_API_URL,
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
} from "./config/constants";
// import rateLimiter from "./middleware/rateLimit";

const app = express();
const PORT = env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== "production") {
  app.use(cors({ origin: env.ALLOWED_ORIGIN, credentials: true }));
} else {
  app.use(cors({ credentials: true }));
}
app.use(cookieParser());
// app.use(rateLimiter);

const apiRouter = express.Router();
apiRouter.use(VERIFICATION_CODE_ROUTES, verificationCodeRoutes);
apiRouter.use(AUTH_ROUTES, authRoutes);
apiRouter.use(PROFILE_ROUTES, profileRoutes);
apiRouter.use(API_KEY_ROUTES, apiKeyRoutes);
apiRouter.use(SESSION_ROUTES, sessionRoutes);

apiRouter.use(IMAGE_ROUTES, imageRoutes);
apiRouter.use(TAG_ROUTES, authenticate, tagRoutes);
apiRouter.use(ITEM_ROUTES, authenticate, itemRoutes);
apiRouter.use(ITEM_ROUTES, authenticate, itemTagRoutes);
apiRouter.use(ITEM_ROUTES, authenticate, itemImageRoutes);
apiRouter.use(COMPONENT_ROUTES, authenticate, componentRoutes);
apiRouter.use(FEED_ROUTES, authenticate, feedRoutes);

app.use(BASE_API_URL, apiRouter);
app.use(errorHandler);

if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.use(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log("server running yo"));
