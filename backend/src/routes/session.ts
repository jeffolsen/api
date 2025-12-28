import express from "express";
import sessionApi from "../controllers/session";
import authorizeScope from "../middleware/authorizeScope";
import {
  SESSION_LOGOUT_ALL_ENDPOINT,
  READ_SESSION_SCOPE,
  SESSION_LOGOUT_ENDPOINT,
  UPDATE_SESSION_SCOPE,
  COLLECTION_ENDPOINT,
} from "../config/constants";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authenticate,
  authorizeScope([READ_SESSION_SCOPE]),
  sessionApi.getProfilesSessions,
);
router.post(
  SESSION_LOGOUT_ENDPOINT,
  authenticate,
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.logout,
);
router.post(SESSION_LOGOUT_ALL_ENDPOINT, sessionApi.logoutAll);

export default router;
