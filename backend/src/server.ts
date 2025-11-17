import "dotenv/config";
import express from "express";
import profileRoutes from "./routes/profiles";
import authRoutes from "./routes/auth";
import requiresAuth from "./middleware/auth";
import handleError, { endPointNotFound } from "./middleware/handleError";
import env from "./util/env";
import cors from "cors";

const app = express();
const PORT = env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/profiles", requiresAuth, profileRoutes);

app.use(endPointNotFound);
app.use(handleError);

app.listen(PORT, () => console.log("server running"));
