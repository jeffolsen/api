import express from "express";
import profileApi from "../controllers/profile";

const router = express.Router();

router.get("/me", profileApi.getAuthenticatedProfile);
router.post("/change-password", profileApi.changePassword);
router.post("/verify-email", profileApi.verifyEmail);
router.delete("/me", profileApi.deleteProfile);

export default router;
