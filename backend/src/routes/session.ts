import express from "express";
import sessionApi from "../controllers/session";
import authorizeScope from "../middleware/authorizeScope";
import { READ_SESSION_SCOPE } from "../config/constants";

const router = express.Router();

router.get(
  "/",
  authorizeScope([READ_SESSION_SCOPE]),
  sessionApi.getProfilesSessions
);

export default router;
