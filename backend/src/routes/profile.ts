import express from "express";
import profileApi from "../controllers/profile";
import authorizeScope from "../middleware/authorizeScope";
import {
  PROFILE_PASSWORD_RESET_ENDPOINT,
  PROFILE_SELF_ENDPOINT,
  PROFILE_DELETE_PROFILE_ENDPOINT,
  READ_PROFILE_SCOPE,
} from "../config/constants";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
  PROFILE_SELF_ENDPOINT,
  authenticate,
  authorizeScope([READ_PROFILE_SCOPE]),
  profileApi.getAuthenticatedProfile,
);
router.post(PROFILE_PASSWORD_RESET_ENDPOINT, profileApi.resetPassword);
router.post(PROFILE_DELETE_PROFILE_ENDPOINT, profileApi.deleteProfile);

export default router;
