import express from "express";
import profileApi from "../controllers/profile";
import authorizeScope from "../middleware/authorizeScope";
import {
  deleteProfileScope,
  readProfileScope,
  updateProfileScope,
} from "../services/scope";

const router = express.Router();

router.get(
  "/me",
  authorizeScope([readProfileScope]),
  profileApi.getAuthenticatedProfile
);
router.delete(
  "/me",
  authorizeScope([deleteProfileScope]),
  profileApi.deleteProfile
);
router.post(
  "/refresh",
  authorizeScope([updateProfileScope]),
  profileApi.verifyEmail
);
router.post(
  "/verify-email",
  authorizeScope([updateProfileScope]),
  profileApi.verifyEmail
);

export default router;
