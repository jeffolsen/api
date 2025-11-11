import express from "express";
import profileApi from "../controllers/profile";

const router = express.Router();

router.post("/signup", profileApi.signup);
router.post("/login", profileApi.login);
router.post("/logout", profileApi.logout);
router.post("/change-password", profileApi.changePassword);
router.post("/verify-email", profileApi.verifyEmail);
router.post("/delete", profileApi.delete);

export default router;
