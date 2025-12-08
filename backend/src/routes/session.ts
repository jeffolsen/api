import express from "express";
import sessionApi from "../controllers/session";
import authorizeScope from "../middleware/authorizeScope";
import { READ_SESSION_SCOPE, UPDATE_SESSION_SCOPE } from "../config/constants";

const router = express.Router();

router.get(
  "/",
  authorizeScope([READ_SESSION_SCOPE]),
  sessionApi.getProfilesSessions
);
router.post(
  "/refresh",
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.refreshToken
);
router.post(
  "/logout",
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.logout
);

export default router;
