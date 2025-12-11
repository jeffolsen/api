import express from "express";
import sessionApi from "../controllers/session";
import authorizeScope from "../middleware/authorizeScope";
import {
  READ_SESSION_SCOPE,
  SESSION_LOGOUT_ENDPOINT,
  SESSION_REFRESH_ENDPOINT,
  UPDATE_SESSION_SCOPE,
} from "../config/constants";

const router = express.Router();

router.get(
  "/",
  authorizeScope([READ_SESSION_SCOPE]),
  sessionApi.getProfilesSessions
);
router.post(
  SESSION_REFRESH_ENDPOINT,
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.refreshToken
);
router.post(
  SESSION_LOGOUT_ENDPOINT,
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.logout
);

export default router;
