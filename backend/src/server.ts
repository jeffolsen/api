import env from "@config/env";
import { initCronJobs } from "@util/cron";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "@middleware/errorHandler";
import apiRouter, { BASE_API_URL } from "@/api";
import { globalLimiter } from "@middleware/rateLimit";
import prismaClient from "@db/client";

const app = express();
const PORT = env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = env.ALLOWED_ORIGIN
  ? env.ALLOWED_ORIGIN.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: async (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const match = await prismaClient.apiKey.findFirst({
        where: { origin },
        select: { id: true },
      });
      callback(null, !!match);
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(globalLimiter);
app.use(BASE_API_URL, apiRouter);
app.use(errorHandler);

initCronJobs();

app.listen(PORT, () => console.log("server running"));

export default app;
