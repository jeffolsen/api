import express from "express";
import sessionApi from "../controllers/session";
import authorizeScope from "../middleware/authorizeScope";
import { READ_SESSION_SCOPE, UPDATE_SESSION_SCOPE } from "../config/scopes";
import {
  SESSION_LOGOUT_ALL_ENDPOINT,
  SESSION_LOGOUT_ENDPOINT,
  COLLECTION_ENDPOINT,
  SESSION_RESET_ENDPOINT,
} from "../config/routes";
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
router.post(
  SESSION_LOGOUT_ALL_ENDPOINT,
  authenticate,
  authorizeScope([UPDATE_SESSION_SCOPE]),
  sessionApi.logoutAllWithSession,
);
router.post(SESSION_RESET_ENDPOINT, sessionApi.logoutAllWithCode);

export default router;
