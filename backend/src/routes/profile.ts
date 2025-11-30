import express from "express";
import profileApi from "../controllers/profile";
import authorizeScope from "../middleware/authorizeScope";
import {
  DELETE_PROFILE_SCOPE,
  READ_PROFILE_SCOPE,
  UPDATE_PROFILE_SCOPE,
} from "../config/constants";

const router = express.Router();

router.get(
  "/me",
  authorizeScope([READ_PROFILE_SCOPE]),
  profileApi.getAuthenticatedProfile
);
router.delete(
  "/me",
  authorizeScope([DELETE_PROFILE_SCOPE]),
  profileApi.deleteProfile
);
router.post(
  "/refresh",
  authorizeScope([UPDATE_PROFILE_SCOPE]),
  profileApi.verifyEmail
);
router.post(
  "/verify-email",
  authorizeScope([UPDATE_PROFILE_SCOPE]),
  profileApi.verifyEmail
);

export default router;
