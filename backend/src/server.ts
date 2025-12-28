import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import profileRoutes from "./routes/profile";
import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/session";
import verificationCodeRoutes from "./routes/verificationCode";
import apiKeyRoutes from "./routes/apiKey";
import authenticate from "./middleware/authenticate";
import errorHandler from "./middleware/errorHandler";

import env from "./config/env";
import {
  API_KEY_ROUTES,
  AUTH_ROUTES,
  PROFILE_ROUTES,
  SESSION_ROUTES,
  VERIFICATION_CODE_ROUTES,
} from "./config/constants";

const app = express();
const PORT = env.PORT || 5001;
const ORIGIN = env.DOMAIN_WHITELIST.length
  ? env.DOMAIN_WHITELIST.split(",")
  : "*";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ORIGIN }));
app.use(cookieParser());

app.use(VERIFICATION_CODE_ROUTES, verificationCodeRoutes);
app.use(AUTH_ROUTES, authRoutes);
app.use(PROFILE_ROUTES, authenticate, profileRoutes);
app.use(SESSION_ROUTES, authenticate, sessionRoutes);
app.use(API_KEY_ROUTES, authenticate, apiKeyRoutes);

// app.use("/api/items", requiresAuth, () => console.log("items"));
// app.use("/api/pages", requiresAuth, () => console.log("pages"));
// app.use("/api/blocks", requiresAuth, () => console.log("blocks"));

app.use(errorHandler);

app.listen(PORT, () => console.log("server running"));
