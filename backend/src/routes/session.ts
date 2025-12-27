import express from "express";
import sessionApi from "../controllers/session";
import authorizeScope from "../middleware/authorizeScope";
import {
  SESSION_LOGOUT_ALL_ENDPOINT,
  LOGOUT_ALL_SCOPE,
  READ_SESSION_SCOPE,
  AUTH_LOGOUT_ENDPOINT,
  UPDATE_SESSION_SCOPE,
} from "../config/constants";

const router = express.Router();

router.get(
  "/",
  authorizeScope([READ_SESSION_SCOPE]),
  sessionApi.getProfilesSessions,
);

router.post(
  SESSION_LOGOUT_ALL_ENDPOINT,
  authorizeScope([LOGOUT_ALL_SCOPE]),
  sessionApi.logoutAll,
);

router.post(
  AUTH_LOGOUT_ENDPOINT,
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.logout,
);

export default router;
