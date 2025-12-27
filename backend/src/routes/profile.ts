import express from "express";
import profileApi from "../controllers/profile";
import authorizeScope from "../middleware/authorizeScope";
import {
  PROFILE_PASSWORD_RESET_ENDPOINT,
  PASSWORD_RESET_SCOPE,
  PROFILE_SELF_ENDPOINT,
  READ_PROFILE_SCOPE,
  DELETE_PROFILE_SCOPE,
  PROFILE_DELETE_PROFILE_ENDPOINT,
} from "../config/constants";

const router = express.Router();

router.get(
  PROFILE_SELF_ENDPOINT,
  authorizeScope([READ_PROFILE_SCOPE]),
  profileApi.getAuthenticatedProfile,
);

router.post(
  PROFILE_PASSWORD_RESET_ENDPOINT,
  authorizeScope([PASSWORD_RESET_SCOPE]),
  profileApi.resetPassword,
);

router.post(
  PROFILE_DELETE_PROFILE_ENDPOINT,
  authorizeScope([DELETE_PROFILE_SCOPE]),
  profileApi.deleteProfile,
);

export default router;
