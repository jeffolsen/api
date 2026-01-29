import "dotenv/config";
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
import componentRoutes from "./routes/component";
import apiKeyRoutes from "./routes/apiKey";
import errorHandler from "./middleware/errorHandler";
import dynamicCors from "./middleware/cors";
import env from "./config/env";
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
} from "./config/constants";
import rateLimiter from "./middleware/rateLimit";

const app = express();
const PORT = env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(dynamicCors));
app.use(rateLimiter);

app.use(VERIFICATION_CODE_ROUTES, verificationCodeRoutes);
app.use(AUTH_ROUTES, authRoutes);
app.use(PROFILE_ROUTES, profileRoutes);
app.use(API_KEY_ROUTES, apiKeyRoutes);
app.use(SESSION_ROUTES, sessionRoutes);

app.use(TAG_ROUTES, authenticate, tagRoutes);
app.use(ITEM_ROUTES, authenticate, itemRoutes);
app.use(COMPONENT_ROUTES, authenticate, componentRoutes);
app.use(FEED_ROUTES, authenticate, feedRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log("server running"));
