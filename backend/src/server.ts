import env from "./config/env";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import path from "path";
import apiRouter, { BASE_API_URL } from "./api";
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
app.use(BASE_API_URL, apiRouter);
app.use(errorHandler);

if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.use(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log("server running yo"));

export default app;
