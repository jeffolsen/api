import "dotenv/config";
import express from "express";
import profileRoutes from "./routes/profiles";
import handleError, { endPointNotFound } from "./middleware/handleError";
import env from "./util/env";
import cors from "cors";

const app = express();
const PORT = env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use("/api/profiles", profileRoutes);

app.use(endPointNotFound);
app.use(handleError);

app.listen(PORT, () => console.log("server running"));
