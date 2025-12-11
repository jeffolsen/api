import express from "express";
import profileApi from "../controllers/profile";
import authorizeScope from "../middleware/authorizeScope";
import { PROFILE_SELF_ENDPOINT, READ_PROFILE_SCOPE } from "../config/constants";

const router = express.Router();

router.get(
  PROFILE_SELF_ENDPOINT,
  authorizeScope([READ_PROFILE_SCOPE]),
  profileApi.getAuthenticatedProfile
);

export default router;
