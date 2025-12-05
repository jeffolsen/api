import express from "express";
import sessionApi from "../controllers/session";
import authorizeScope from "../middleware/authorizeScope";
import { UPDATE_SESSION_SCOPE } from "../config/constants";

const router = express.Router();

router.get("/", sessionApi.getProfilesSessions);
router.post(
  "/refresh",
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.refreshToken
);

export default router;
