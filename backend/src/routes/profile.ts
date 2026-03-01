import express from "express";
import profileApi from "../controllers/profile";
import authorizeScope from "../middleware/authorizeScope";
import {
  PROFILE_PASSWORD_RESET_ENDPOINT,
  SELF_ENDPOINT,
  PROFILE_DELETE_PROFILE_ENDPOINT,
  READ_PROFILE_SCOPE,
  DELETE_PROFILE_SCOPE,
  UPDATE_PROFILE_SCOPE,
  PROFILE_PASSWORD_CHANGE_ENDPOINT,
} from "../config/constants";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
  SELF_ENDPOINT,
  authenticate,
  authorizeScope([READ_PROFILE_SCOPE]),
  profileApi.getAuthenticatedProfile,
);
router.post(
  PROFILE_DELETE_PROFILE_ENDPOINT,
  authenticate,
  authorizeScope([DELETE_PROFILE_SCOPE]),
  profileApi.deleteProfile,
);
router.post(
  PROFILE_PASSWORD_CHANGE_ENDPOINT,
  authenticate,
  authorizeScope([UPDATE_PROFILE_SCOPE]),
  profileApi.changePasswordWithSession,
);

router.post(PROFILE_PASSWORD_RESET_ENDPOINT, profileApi.resetPasswordWithCode);

export default router;
